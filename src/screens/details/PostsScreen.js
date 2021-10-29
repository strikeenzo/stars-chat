import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

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

const ic_back = require('../../assets/images/Icons/ic_back.png');

const VIDEO_HEIGHT = Dimensions.get('window').height;

class PostsScreen extends Component {
  constructor(props) {
    super(props);

    this.profileSheet = React.createRef();
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
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={7}
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
  };

  _renderItem = ({ item, index }) => (
    <RenderPosts
      item={item}
      curIndex={this.state.curIndex}
      isVideoPause={this.state.isVideoPause}
      actions={this.actions}
      index={index}
      detailStyle={{ bottom: 36 + Helper.getBottomBarHeight() }}
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

export default function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  return <PostsScreen {...props} navigation={navigation} route={route} />;
}

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
