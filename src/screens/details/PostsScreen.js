import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';

import ProgressModal from '../../components/ProgressModal';
import RenderPosts from '../../components/posts/RenderPosts';

import {
  Constants,
  Global,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import CommentsScreen from './CommentsScreen';
import RBSheet from 'react-native-raw-bottom-sheet';
import CachedImage from '../../components/CachedImage';
import Gifts from '../../components/LiveStream/Gifts/Gifts';
import { setMyUserAction } from '../../redux/me/actions';
import { setGifts } from '../../redux/liveStream/actions';

const ic_back = require('../../assets/images/Icons/ic_back.png');

const VIDEO_HEIGHT = Dimensions.get('window').height;

class PostsScreen extends Component {
  constructor(props) {
    super(props);

    this.profileSheet = React.createRef();
    this.giftBottomSheet = React.createRef();

    this.init();
  }

  init = () => {
    this.state = {
      isVideoPause: false,

      isVisibleProgress: false,
      percent: 0,

      isFetching: false,
      isLiking: false,
      totalCount: global._totalCount,
      curPage: global._curPage ? global._curPage : '1',
      keyword: global._keyword ? global._keyword : '',
      posts: global._postsList || [],
      curIndex: 0,
      item: {},
      layout: { width: 0, height: 0 },
    };
  };

  componentDidMount() {
    global.checkSignIn = this.checkSignIn;
    this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      this.setState({ isVideoPause: false });
    });
    this.unsubscribeBlur = this.props.navigation.addListener('blur', () => {
      this.setState({ isVideoPause: true });
    });
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }

  componentWillUnmount() {
    this.unsubscribeFocus && this.unsubscribeFocus();
    this.unsubscribeBlur && this.unsubscribeBlur();
    global.checkSignIn = null;
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onViewableItemsChanged = ({ changed }) => {
    changed.forEach((change) => {
      if (change.isViewable) {
        const item = change?.item;
        if (this.state.item?.id !== change?.item.id) {
          this.setState({ curIndex: change.index, item });
          global._opponentUser = item.user;
          let params = {
            postId: item.id,
            viewerId: global.me ? global.me.id : 0,
            deviceType: Platform.OS === 'ios' ? '1' : '0',
            deviceIdentifier: global._deviceId,
          };
          RestAPI.update_post_view(params, (json, err) => {});
        }
      } else {
      }
    });
  };

  onPressAvatar = () => {
    const user = this.state.item?.user || {};
    if (global.me) {
      if (user.id === global.me?.id) {
        this.props.navigation.navigate('profile');
      } else {
        global._opponentUser = user;
        global._prevScreen = 'profile_video';
        this.props.navigation.navigate('profile_other');
      }
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onPressReport = () => {
    const params = {
      userId: global.me?.id,
      postId: this.state.item?.id,
    };

    RestAPI.report_post(params, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          global.success(Constants.SUCCESS_TITLE, 'Success to report');
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };
  onPressLike = (isChecked) => {
    if (this.state.isLiking) {
      return;
    }
    if (global.me) {
      const item = this.state.item || {};
      const { posts } = this.state;
      item.likeCount = (item.likeCount || 0) + (isChecked ? 1 : -1);
      item.isLiked = isChecked;
      const params = {
        userId: global.me?.id,
        ownerId: item?.user?.id,
        postId: item.id,
        isLiked: isChecked,
      };
      this.setState({ isLiking: true });
      RestAPI.update_like_post(params, (json, err) => {
        global.showForcePageLoader(false);

        if (err !== null) {
          Helper.alertNetworkError(err?.message);
        } else {
          if (json.status === 200) {
            this.setState({ posts });
          } else {
            Helper.alertServerDataError();
          }
        }
        this.setState({ isLiking: false });
      });
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onPressShare = () => {
    if (global.me) {
      Global.sharePost(this.state.item, global.me);
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onOpenProfileSheet = () => {
    this.profileSheet?.current?.open();
  };

  onCloseComments = () => {
    this.profileSheet?.current?.close();
  };

  onAddComment = (postId, commentsCount) => {
    const { posts } = this.state;
    const newPosts = [...posts];
    const item = newPosts.find((p) => p.id === postId);
    if (item) {
      item.commentsCount = commentsCount;
    }
    this.setState({ posts: newPosts });
  };

  setLayout = (event) => {
    this.setState({
      layout: {
        width: event.nativeEvent.layout?.width,
        height: event.nativeEvent.layout?.height,
      },
    });
  };

  onPressGiftAction = () => {
    this.giftBottomSheet?.current?.open();
  };

  onPressSendGift = (gift) => {
    const user = this.props.user || {};
    if (user.diamond <= gift.diamond) {
      return;
    }
    this.giftBottomSheet?.current?.close();
    const item = this.state.item || {};

    const params = {
      giftId: gift?.id,
      userId: user?.id,
      posterId: item?.user?.id,
    };
    RestAPI.send_gift_post(params, (json, err) => {
      if (err !== null) {
        global.success(
          Constants.ERROR_TITLE,
          'Failed to sent a gift! Try again later.',
        );
      } else {
        if (json.status === 200) {
          global.success(Constants.SUCCESS_TITLE, 'Sent a gift!');
          this.props.setMyUserAction({
            ...user,
            diamond: (user.diamond || 0) - (gift.diamond || 0),
          });
        } else {
          global.success(
            Constants.ERROR_TITLE,
            'Failed to sent a gift! Try again later.',
          );
        }
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={[GStyles.container, styles.container]}>
        {this.___renderStatusBar()}
        {this._renderVideo()}
        {this._renderProgress()}
        {this._renderBack()}
        <RBSheet
          ref={this.profileSheet}
          openDuration={250}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            draggableIcon: {
              width: 0,
              height: 0,
              padding: 0,
              margin: 0,
            },
            container: {
              height: VIDEO_HEIGHT * 0.75,
            },
          }}
        >
          <CommentsScreen
            post={this.state.item}
            onCloseComments={this.onCloseComments}
            onAddComment={this.onAddComment}
          />
        </RBSheet>
        <RBSheet
          ref={this.giftBottomSheet}
          openDuration={250}
          customStyles={{
            container: styles.sheetGiftContainer,
            wrapper: styles.sheetWrapper,
            draggableIcon: styles.sheetDragIcon,
          }}
        >
          <Gifts onPressSendGift={this.onPressSendGift} />
        </RBSheet>
      </SafeAreaView>
    );
  }

  _renderBack = () => {
    return (
      <TouchableOpacity
        style={GStyles.backButtonContainer}
        onPress={this.onBack}
      >
        <CachedImage
          source={ic_back}
          style={{ width: 16, height: 16, tintColor: 'white' }}
          resizeMode={'contain'}
          tintColor={'white'}
        />
      </TouchableOpacity>
    );
  };

  keyExtractor = (item, index) => index.toString();

  _renderVideo = () => {
    const { isFetching, posts } = this.state;

    return (
      <View style={styles.flatList} onLayout={this.setLayout}>
        <FlatList
          showsVerticalScrollIndicator={false}
          initialScrollIndex={
            posts.length > global._selIndex ? global._selIndex : 0
          }
          getItemLayout={(data, index) => ({
            length: this.state.layout.height,
            offset: this.state.layout.height * index,
            index,
          })}
          pagingEnabled
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={9}
          removeClippedSubviews={false}
          refreshing={isFetching}
          onEndReachedThreshold={0.4}
          data={posts}
          renderItem={this._renderItem}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10,
          }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          keyExtractor={this.keyExtractor}
          style={{ height: '100%', width: '100%' }}
        />
      </View>
    );
  };

  actions = {
    onPressLike: this.onPressLike,
    onPressShare: this.onPressShare,
    onPressAvatar: this.onPressAvatar,
    onPressReport: this.onPressReport,
    onOpenProfileSheet: this.onOpenProfileSheet,
    onPressGiftAction: this.onPressGiftAction,
  };

  _renderItem = ({ item, index }) => (
    <RenderPosts
      item={item}
      curIndex={this.state.curIndex}
      isVideoPause={this.state.isVideoPause}
      actions={this.actions}
      index={index}
      detailStyle={{ bottom: 56 + Helper.getBottomBarHeight() }}
      layout={this.state.layout}
    />
  );

  _renderProgress = () => {
    const { percent, isVisibleProgress } = this.state;

    return <ProgressModal percent={percent} isVisible={isVisibleProgress} />;
  };

  ___renderStatusBar = () => {
    return <StatusBar hidden />;
  };
}

const PostsScreenWrapper = (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <PostsScreen {...props} navigation={navigation} route={route} />;
};

export default connect(
  (state) => ({
    user: state.me?.user || {},
    gifts: state.liveStream?.gifts || [],
  }),
  { setMyUserAction, setGifts },
)(PostsScreenWrapper);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  flatList: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
