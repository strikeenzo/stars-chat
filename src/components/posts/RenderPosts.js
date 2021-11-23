import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
/*
import Video from 'react-native-video';
*/
import VideoPlayer from 'react-native-video-controls';

import { GStyle, GStyles, Global } from '../../utils/Global';
import Avatar from '../elements/Avatar';
import avatars from '../../assets/avatars';
import Helper from '../../utils/Global/Util';
import CachedImage from '../CachedImage';

import LottieView from 'lottie-react-native';
import Heart from '../../assets/lottie/heart';

const heart = require('../../assets/images/gifts/heart.png');
const eye = require('../../assets/images/Icons/ic_eye.png');
const ic_comment = require('../../assets/images/Icons/ic_comment.png');
import ic_gift from '../../assets/images/Icons/ic_gift.png';
const ic_share = require('../../assets/images/Icons/ic_share.png');

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl =
  'https://res.cloudinary.com/snaplist/image/upload/v1634327167/permanent/avatarFaces/1080xcorner_rsgs52.jpg';

class RenderPosts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showTexts: false,
      lastPress: 0,
      showHeart: false,
      paused: false,
    };
  }

  componentWillUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any,
  ) {
    const { curIndex, index, isVideoPause } = nextProps;
    const { paused } = this.state;

    const inactive = isVideoPause || curIndex !== index;

    if (paused !== inactive) {
      this.setState({ paused: inactive });
    }
  }

  onLike = () => {
    const { item, actions } = this.props;
    const isLike = !!item.isLiked;

    if (!isLike) {
      this.setState({ showHeart: true });
      setTimeout(() => {
        this.setState({ showHeart: false });
      }, 1000);
    }
    actions.onPressLike(!isLike);
  };

  onPress = () => {
    const delta = new Date().getTime() - this.state.lastPress;

    if (delta < 200) {
      this.onLike();
      this.setState({ lastPress: 0 });
    } else {
      this.setState({ lastPress: new Date().getTime() });
      this.setState((prev) => ({ showTexts: !prev.showTexts }));
    }
  };

  onPressComments = () => {
    this.props.actions.onOpenProfileSheet();
  };

  onReadyForDisplay = () => {
    const { curIndex, index, isVideoPause } = this.props;
    const inactive = isVideoPause || curIndex !== index;
    this.setState({ paused: inactive });
  };

  onLoadStart = () => {
    this.setState({ paused: false });
  };

  checkIfBlockedMe = (thisUser) => {
    return thisUser?.blockList?.some((r) => r === global.me?.id);
  };

  checkIfBlocked = (thisUser) => {
    return global?.me?.blockList?.some((r) => r === thisUser?.id);
  };

  render() {
    const { showHeart, showTexts, paused } = this.state;
    const {
      item,
      actions,
      detailStyle,
      isVideoPause,
      curIndex,
      index,
      layout,
    } = this.props;

    const user = item.user || {};
    const isLike = !!item.isLiked;

    const viewCount = Math.floor(item.viewCount || 0);
    const likeCount = Math.floor(
      typeof item.likeCount === 'number' ? item.likeCount : 0,
    );

    return (
      <View style={[styles.container, layout]}>
        <>
          {Math.abs(curIndex - index) < 3 && !isVideoPause ? (
            <VideoPlayer
              source={{
                uri: Global.convertToHLS(item.url || ''),
              }}
              controls={false}
              seekColor={'#ff0000'}
              disableVolume={true}
              disableBack={true}
              disableFullscreen={true}
              disableTimer={true}
              disablePlayPause={true}
              repeat
              paused={paused}
              muted={paused}
              poster={item.thumb}
              resizeMode="contain"
              posterResizeMode="contain"
              style={styles.video}
              onReadyForDisplay={this.onReadyForDisplay}
              onLoadStart={this.onLoadStart}
              reportBandwidth={true}
            />
          ) : (
            <CachedImage
              source={{ uri: item.thumb || '' }}
              style={styles.video}
              resizeMode="contain"
            />
          )}

          {showHeart && (
            <View style={styles.lottieContainer}>
              <LottieView source={Heart} autoPlay loop style={styles.lottie} />
            </View>
          )}
          <TouchableOpacity
            style={[GStyles.playInfoWrapper, detailStyle, styles.detailStyle]}
            activeOpacity={1}
            onPress={this.onPress}
          >
            <View style={styles.textsContainer}>
              {showTexts && (
                <>
                  {!!item?.title && (
                    <View style={styles.textContainer}>
                      <Text numberOfLines={5} style={styles.title}>
                        {item.title}
                      </Text>
                    </View>
                  )}
                  {!!item?.description && (
                    <View style={[styles.textContainer, { marginTop: 12 }]}>
                      <Text numberOfLines={5} style={styles.description}>
                        {item.description}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={GStyles.centerAlign}>
              <TouchableOpacity
                onPress={this.onLike}
                style={[GStyles.videoActionButton]}
              >
                <CachedImage
                  source={heart}
                  style={{
                    ...GStyles.actionIcons,
                    tintColor: isLike ? GStyle.primaryColor : 'white',
                  }}
                  tintColor={isLike ? GStyle.primaryColor : 'white'}
                />
              </TouchableOpacity>
              <Text style={GStyles.textSmall}>{likeCount}</Text>
              {this.checkIfBlockedMe(user) ||
              this.checkIfBlocked(user) ? null : (
                <TouchableOpacity
                  onPress={actions.onPressGiftAction}
                  style={GStyles.videoActionButton}
                >
                  <CachedImage
                    source={ic_gift}
                    style={GStyles.actionIcons}
                    tintColor={'white'}
                  />
                </TouchableOpacity>
              )}
              {/*{this.checkIfBlockedMe(user) ||*/}
              {/*this.checkIfBlocked(user) ? null : (*/}
              {/*  <Text style={GStyles.textSmall}>{item.commentsCount || 0}</Text>*/}
              {/*)}*/}

              <TouchableOpacity
                onPress={actions.onPressShare}
                style={GStyles.videoActionButton}
              >
                <CachedImage
                  source={ic_share}
                  style={GStyles.actionIcons}
                  tintColor={'white'}
                />
              </TouchableOpacity>
              <Avatar
                image={{
                  uri: user.photo ? user.photo : randomImageUrl,
                }}
                size={40}
                onPress={actions.onPressAvatar}
                containerStyle={{ marginVertical: 16 }}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.topPart}>
            <TouchableOpacity
              style={styles.topBadge}
              onPress={actions.onPressReport}
            >
              <Text style={GStyles.textSmall}>Report</Text>
            </TouchableOpacity>
            {/*<View style={styles.topBadge}>
              <CachedImage
                source={eye}
                style={styles.viewCountIcon}
                tintColor="white"
              />
              <Text style={GStyles.textSmall}>{viewCount}</Text>
            </View>*/}
          </View>
        </>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  topPart: {
    position: 'absolute',
    flexDirection: 'row',
    right: 16,
    top: 32 + Helper.getStatusBarHeight(),
  },
  video: {
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  detailStyle: {
    flexDirection: 'row',
    ...GStyles.rowBetweenContainer,
  },
  lottieContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    height: 150,
    alignSelf: 'center',
    position: 'absolute',
  },
  title: {
    ...GStyles.elementLabel,
    color: 'white',
  },
  description: {
    ...GStyles.textSmall,
    color: 'white',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    borderRadius: 8,
  },
  textsContainer: {
    flex: 1,
    height: '100%',
    marginRight: 12,
    justifyContent: 'flex-end',
  },
  topBadge: {
    flexDirection: 'row',
    ...GStyles.centerContainer,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  viewCountIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
    marginRight: 6,
  },
});

export default RenderPosts;
