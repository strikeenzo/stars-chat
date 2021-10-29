import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';

import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import {
  Constants,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import GHeaderBar from '../../components/GHeaderBar';
import Avatar from '../../components/elements/Avatar';
import Achievements from '../../components/profile/Achievements';

import avatars from '../../assets/avatars';
import CachedImage from '../../components/CachedImage';
import PostPure from './PostPure';
import { ScrollView } from 'react-native-gesture-handler';
import VideoPostItem from '../../components/VideoPostItem';
import RBSheet from 'react-native-raw-bottom-sheet';
import { setMyUserAction } from '../../redux/me/actions';

const ic_plus_1 = require('../../assets/images/Icons/ic_plus_1.png');
const ic_message = require('../../assets/images/Icons/ic_menu_messages.png');

const WINDOW_WIDTH = Helper.getWindowWidth();
const CELL_WIDTH = (WINDOW_WIDTH - 32 - 10) / 3.0;

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = 'https://res.cloudinary.com/snaplist/image/upload/v1634327167/permanent/avatarFaces/1080xcorner_rsgs52.jpg';

class ProfileOtherScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh()
    this.onRefreshPosts();
    this.onRefreshProducts();
  }

  init = () => {
    this.state = {
      products: [],
      posts: [],
      opponentUser: null,
      isLoading: false,
      isEndOfList: false,
      totalCount: 0,
      curPage: 1,
      searchTerm: '0'
    };
  };

  loadProducts = () => {
    let params = {
      me_id: global.me ? global.me?.id : 0,
      user_id: global._opponentUser?.id,
      page_number: 1,
      count_per_page: 50,
    };
    this.setState({ isLoading: true });
    RestAPI.get_user_video_list(params, (json, err) => {
      this.setState({ isLoading: false });

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200 && json?.data) {
          if (json?.data?.videoList) {
            this.setState({
              products: json.data.videoList || [],
            });
          }

          if (json?.data?.user) {
            this.setState({
              opponentUser: json.data.user,
            });
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onRefresh = () => {
    let params = {
      user_id: global.me?.id,
    };
    RestAPI.get_user_profile(params, (json, err) => {
      global.showForcePageLoader(false);
      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200) {
          const user = json.data || {};
          this.props.setMyUserAction(user);
          global.me = user;
          Helper.setLocalValue(Constants.KEY_USER, JSON.stringify(global.me));
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  loadPosts = (type) => {
    if (this.state.isEndOfList) return;
    const countPerPage = 50;
    const newPage = type === 'more' ? this.state.curPage + 1 : 1;
    this.setState({ curPage: newPage });
    if (type === 'more') {
      const maxPage = (this.state.totalCount + countPerPage - 1) / countPerPage;
      if (newPage > maxPage) {
        this.setState({ isEndOfList: true });
        return;
      }
    }
    this.setState({ curPage: newPage, isLoading: true });

    let params = {
      me_id: global.me ? global.me?.id : 0,
      user_id: global._opponentUser?.id,
      page_number: type === 'more' ? newPage : 1,
      count_per_page: countPerPage,
    };
    this.setState({ isLoading: true });

    RestAPI.get_user_post_list(params, (json, err) => {
      this.setState({ isLoading: false });

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          this.setState({ totalCount: json.data?.totalCount || 0 });
          const list = json.data.postList || [];

          if (type === 'more') {
            let data = this.state.posts.concat(list);
            this.setState({ posts: data });
          } else {
            this.setState({ posts: list });
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onRefreshProducts = () => {
    if (!global._opponentUser?.id || this.state.isLoading) return;
    console.log('refresging...');

    this.loadProducts();
  };

  onRefreshPosts = (type) => {
    if (
      !global._opponentUser?.id ||
      this.state.isLoading ||
      this.state.isEndOfList
    )
      return;
    console.log('refresging...');

    this.loadPosts(type);
  };

  onPressVideo = (value) => {
    const { products } = this.state;
    global._selIndex = products.findIndex((obj) => obj.id === value);
    global._productsList = products;
    global._prevScreen = 'profile_other';
    const pushAction = StackActions.push('profile_video', null);
    this.props.navigation.dispatch(pushAction);
  };
  onPressPost = (value) => {
    const { posts } = this.state;
    global._selIndex = posts.findIndex((obj) => obj.id === value);
    global._postsList = posts;
    global._prevScreen = 'profile_other';
    const pushAction = StackActions.push('post_detail', null);
    this.props.navigation.dispatch(pushAction);
  };

  onChangeLike = () => {
    let params = {
      user_id: global.me ? global.me?.id : 0,
      other_id: global._opponentUser?.id,
    };
    RestAPI.update_user_like(params, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200 && json?.data) {
          this.setState({
            opponentUser: json.data,
          });
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  checkIfBlocked = (thisUser) => {
    return global.me?.blockList?.some(r => r === thisUser?.id)
  }

  checkIfBlockedMe = (thisUser) => {
    return thisUser?.blockList?.some(r => r === global.me?.id)
  }
  onBlock = (blockedUserId) => {
    let params = {
      userId: global.me ? global.me?.id : 0,
      blockedUserId: blockedUserId,
    };
    RestAPI.block_member(params, (json, err) => {
      if (err !== null) {
        //Helper.alertNetworkError();
      } else {
        if (json.status === 200 && json?.data) {
         /*  this.setState({
            opponentUser: json.data,
          }); */

         // console.log(json.data)
        } else {
         // Helper.alertServerDataError();
        }
      }
    });

    this.onRefresh()
  }
  onUnblock = (blockedUserId) => {
    let params = {
      userId: global.me ? global.me?.id : 0,
      blockedUserId: blockedUserId,
    };
    RestAPI.unblock_member(params, (json, err) => {
      if (err !== null) {
        //Helper.alertNetworkError();
      } else {
        if (json.status === 200 && json?.data) {
         /*  this.setState({
            opponentUser: json.data,
          }); */

          //console.log(json.data)
        } else {
         // Helper.alertServerDataError();
        }
      }
    });

    this.onRefresh()
  }
  onPressChat = () => {
    this.props.navigation.navigate('message_chat', {
      opponentUser: this.state.opponentUser || {},
    });
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { opponentUser, posts, products } = this.state;
    return (
      <>
        <View style={styles.container}>
          {this._renderHeader()}
          {this._renderAvartar()}
          {opponentUser && (
            <>
              {/* <ScrollView> */}
              <Achievements opponentUser={opponentUser} check={false} />
              {/* {!!products?.length && this._renderVideo()} */}
              <View style={{ flexGrow: 1 }}>
                {!!posts?.length && this._renderPosts()}
              </View>
              {/* </ScrollView> */}
              {this._renderBottom()}
            </>
          )}
             <RBSheet
              ref={ref => {
              this.RBSheet = ref;
            }}        
            closeOnDragDown
            openDuration={250}
            customStyles={{
            container: {
              backgroundColor: '#fff',
              height: 100,
              overflow: 'visible',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            },
            wrapper: styles.sheetWrapper,
            draggableIcon: styles.sheetDragIcon,
          }}
        >
                 {this.checkIfBlocked(opponentUser) || this.checkIfBlocked(opponentUser) ? (<TouchableOpacity onPress={()=> {this.onUnblock(opponentUser?.id), this.onCloseBlockRed()}}>
                  <Text
                  style={styles.block}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  Unblock user
                </Text>
                </TouchableOpacity> ) : (
                   <TouchableOpacity onPress={()=> {this.onBlock(opponentUser?.id), this.onCloseBlockRed()}}>
                   <Text
                   style={styles.block}
                   ellipsizeMode="tail"
                   numberOfLines={1}
                 >
                   Block user
                 </Text>
                 </TouchableOpacity>)
                }
        </RBSheet>
        </View>
      </>
    );
  }
onOpenBlockRef = () => {
  this.RBSheet.open()
}
onCloseBlockRed = () => {
  this.RBSheet.close()
}
  _renderHeader = () => {
    const opponentUser = this.state.opponentUser;

    return (
      <GHeaderBar
        headerTitle={opponentUser?.displayName}
        leftType="back"
        onPressLeftButton={this.onBack}
        rightType='more_ver'
        onPressRightButton={this.onOpenBlockRef}
      />
    );
  };

  _renderBottom = () => {
    const opponentUser = this.state.opponentUser;
    const isFollowing = opponentUser?.isFollowing;

    return (
      <View style={[GStyles.rowEvenlyContainer, styles.bottom]}>
        {opponentUser && (
          <>
            {this.checkIfBlockedMe(opponentUser) || this.checkIfBlocked(opponentUser) ? null :<TouchableOpacity
              style={[
                styles.followButtonWrapper,
                isFollowing && { backgroundColor: GStyle.grayColor },
              ]}
              onPress={this.onChangeLike}
            >
              {isFollowing ? null :<CachedImage
                source={ic_plus_1}
                style={[styles.buttonIcons, { tintColor: '#fff' }]}
                tintColor="#fff"
              />}
              <Text style={[GStyles.regularText, { color: '#fff', fontWeight: 'bold' }]}>
                {isFollowing ? 'Followed' : 'Follow'}
              </Text>
            </TouchableOpacity>}
            {this.checkIfBlockedMe(opponentUser) || this.checkIfBlocked(opponentUser)? null: <TouchableOpacity
              style={styles.chatButtonWrapper}
              onPress={this.onPressChat}
            >
              <Text
                style={[GStyles.regularText, { color: '#fff', fontWeight: 'bold' }]}
              >
                Send DM
              </Text>
            </TouchableOpacity>}
          </>
        )}
      </View>
    );
  };
  
  _renderAvartar = () => {
    const { opponentUser } = this.state;
    const avatar = {
      uri: opponentUser?.photo ? opponentUser?.photo : randomImageUrl,
    };

    const displayName =
      opponentUser?.userType === 0
        ? opponentUser?.displayName
        : opponentUser?.username;
    return (
      <View
        style={styles.gradient}
      >
        <Avatar image={avatar} size={70} />
        {opponentUser && (
          <View style={styles.profileDetailWrapper}>
                <Text
                  style={styles.textId}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  ID: {opponentUser?.uniqueId}
                </Text>
              {/* <TouchableOpacity style={styles.buttonCopy}>
                <Text style={GStyles.elementLabel}>Copy</Text>
              </TouchableOpacity> */}
              <View style={{width: '80%',flexDirection: 'row', alignSelf: 'center'}}>
              {opponentUser?.isVerified && (
                <View style={{  height: 30,
                  width: '25%',
                  overflow: 'hidden',
                  backgroundColor: '#3AFA95',
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',marginRight: opponentUser?.isVerified && opponentUser?.isOfficial ? 10 : 0}}>
                <Text style={[GStyles.elementLabel, styles.verified]}>
                  Verified
                </Text>
                </View>
              )}
               {opponentUser?.isOfficial && (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#BB8323', '#F8F278', '#BB8323']} style={styles.officialContainer}>
                <Text style={[GStyles.elementLabel, styles.official]}>
                  Official
                </Text>
                </LinearGradient>)}
                </View>
            </View>
        )}
      </View>
    );
  };

  _renderVideo = () => {
    const { products } = this.state;

    return (
      <View style={styles.listContainer}>
        <Text style={[GStyles.regularText, GStyles.boldText]}>Products</Text>
        <View style={styles.videosWrapper}>
          {products?.map((item, i) => {
            return (
              <View
                key={i}
                style={[styles.listItem, { marginLeft: i % 3 === 0 ? 0 : 5 }]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onPressVideo(item.id);
                  }}
                >
                  <FastImage
                    source={{
                      uri: item.thumb || '',
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: CELL_WIDTH,
                      height: 120,
                      backgroundColor: '#ccc',
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  _renderPosts = () => {
    const { posts, isLoading, isEndOfList, products } = this.state;
    
    const PostFooter = () =>
      this.state.isLoading && (
        <ActivityIndicator style={{ color: '#000', paddingTop: 10 }} />
      );

    return (
      <View style={styles.listContainer}>
        <StatusBar hidden />
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <TouchableOpacity onPress={() => {this.setState({searchTerm: '0'})}}>
        <Text style={[GStyles.newRegularText, GStyles.boldText, {color: this.state.searchTerm == '0' ? 'white' : 'grey'}]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>{this.setState({searchTerm: '1'})}}>
        {products?.length ? <Text style={[GStyles.newRegularText, GStyles.boldText, {marginLeft: 30,color: this.state.searchTerm == '1' ? 'white' : 'grey'}]}>Products</Text>: null}
        </TouchableOpacity>
</View>
        <View style={styles.videosWrapper}>
          <FlatList
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            onRefresh={() => this.onRefreshPosts('pull')}
            refreshing={!isEndOfList && isLoading}
            onEndReachedThreshold={0.1}
            ListFooterComponent={PostFooter}
            onEndReached={() => {
              this.onRefreshPosts('more');
            }}
            data={this.state.searchTerm == '0' ? posts: products}
            renderItem={({ item, index }) => (
              <VideoPostItem
                item={item}
                index={index}
                onPressPost={this.onPressPost}
                searchTerm={this.state.searchTerm}
                length={this.state.searchTerm == '0' ? posts?.length : products?.length}
                count={this.state.totalCount}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            // style={{ flex: 1, height: 440 }}
            style={{
              height:
                Constants.WINDOW_HEIGHT - (Platform.OS === 'ios' ? 445.7 : 400),
              flex: 1,
            }}
          />
        </View>
      </View>
    );
  };
}


const styles = StyleSheet.create({
  bottom: {
    paddingVertical: 16,
    marginBottom: 10,
  },
  container: {
    backgroundColor: '#2A2B2F',
    flexGrow: 1,
  },
  gradient: {
  height: '20%',
  alignSelf: 'center', 
  alignItems: 'center',
  marginTop: 20
  },

  textId: {
    ...GStyles.newRegularText,
    color: GStyle.whiteColor,
  },
  buttonCopy: {
    ...GStyles.centerAlign,
    padding: 4,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: GStyle.lineColor,
    borderRadius: 4,
    marginLeft: 12,
  },
  profileDetailWrapper: {
    flex: 1,
    ...GStyles.columnEvenlyContainer,
    alignItems: 'center'
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: 16,
  },
  videosWrapper: {
    flex: 1,
  },
  followButtonWrapper: {
    ...GStyles.rowCenterContainer,
    backgroundColor: '#19F2DC',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 120,
    height: 55,
    width: '45%'
  },
  chatButtonWrapper: {
    ...GStyles.rowCenterContainer,
    backgroundColor: '#1E1D26',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 120,
    height: 55
  },
  buttonIcons: {
    width: 16,
    height: 16,
    marginRight: 12,
  },
  listItem: {
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  verified: {
    borderColor: GStyle.greenColor,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  official: {
    borderColor: GStyle.greenColor,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  officialContainer: {
    height: 30,
    width: '25%',
    overflow: 'hidden',
    backgroundColor: '#98FB98',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetDragIcon: {
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
  },
  sheetWrapper: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  block: {
    fontSize: 20,
    fontFamily: 'GothamPro',
    color:'black',
    fontWeight: 'bold'
  }
});


export default connect(
  (state) => ({
    user: state.me.user,
  }),
  { setMyUserAction },
)(function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <ProfileOtherScreen {...props} navigation={navigation} route={route} />
  );
});