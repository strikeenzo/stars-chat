import React from 'react';
import {
  Animated,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';

import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import Avatar from '../../components/elements/Avatar';
import avatars from '../../assets/avatars';

import { setMyUserAction } from '../../redux/me/actions';

import {
  Constants,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import LinearGradient from 'react-native-linear-gradient';
import ic_tab_liveStream from '../../assets/images/Icons/ic_tab_liveStream_bold.png';
import ic_chevron_right from '../../assets/images/Icons/ic_chevron_right.png';
import ic_menu_messages from '../../assets/images/Icons/ic_menu_messages_new.png';
import ic_menu_fans from '../../assets/images/Icons/ic_menu_fans_new.png';
import ic_menu_drafts from '../../assets/images/Icons/ic_menu_drafts.png';
import ic_stars from '../../assets/images/Icons/ic_plus_1.png';
import ic_menu_saved_products from '../../assets/images/Icons/ic_tab_home_bold.png';
import ic_my_products from '../../assets/images/Icons/ic_tab_home_bold.png';
import ic_my_videos from '../../assets/images/Icons/ic_tab_play_bold.png';
import ic_support from '../../assets/images/Icons/ic_support.png';
import ic_sign from '../../assets/images/Icons/ic_vip_new.png';
import ChatStreamSocketManager from '../../utils/Message/SocketManager';
import Achievements from '../../components/profile/Achievements';
import CachedImage from '../../components/CachedImage';

const getMenuItems = (navigation, setMyUserAction) => {
  let menu = [
    {
      icon: ic_tab_liveStream,
      title: 'Start broadcast',
      hideGuest: true,
      onPress: () => {
        navigation.navigate('go_live');
      },
    },
    {
      icon: ic_my_products,
      title: 'My Products',
      hideGuest: true,
      key: 'products',
      onPress: () => {
        navigation.navigate('my_products');
      },
    },
    {
      icon: ic_my_videos,
      title: 'My Videos',
      key: 'videos',
      hideGuest: true,
      onPress: () => {
        navigation.navigate('my_posts');
      },
    },
    {
      icon: ic_menu_saved_products,
      title: 'Liked Products',
      key: 'products',
      onPress: () => {
        navigation.navigate('saved_products');
      },
    },
    {
      icon: ic_menu_messages,
      title: 'Messages',
      key: 'messages',
      onPress: () => {
        navigation.navigate('message');
      },
    },
    {
      icon: ic_menu_fans,
      title: 'Fans',
      hideGuest: true,
      onPress: () => {
        navigation.navigate('fans_screen');
      },
    },
    {
      icon: ic_stars,
      title: 'Following',
      onPress: () => {
        navigation.navigate('following_users');
      },
    },
    {
      icon: ic_stars,
      title: 'User Guidelines',
      onPress: () => {
        Linking.openURL(
          'https://sites.google.com/view/starsindustries-guidelines/home',
        );
      },
    },
    {
      icon: ic_stars,
      title: 'Terms of Services',
      onPress: () => {
        Linking.openURL(
          'https://sites.google.com/view/starsindustries-terms/home',
        );
      },
    },
    {
      icon: ic_stars,
      title: 'Privacy Policy',
      onPress: () => {
        Linking.openURL(
          'https://sites.google.com/view/starsindustries-privacy/home',
        );
      },
    },
    {
      icon: ic_support,
      title: '01913379598',
      onPress: () => {
        Linking.openURL('tel:01913379598');
      },
    },
  ];
  menu.push(
    global.me?.userType === 0
      ? {
          icon: ic_sign,
          title: 'Artist Account',
          onPress: () => {
            global._prevScreen = 'profile_edit';
            navigation.navigate('signin');
          },
        }
      : {
          icon: ic_sign,
          title: 'Guest Account',
          onPress: async () => {
            ChatStreamSocketManager.instance.emitLeaveRoom({
              roomId: global.me?.id,
              userId: global.me?.id,
            });
            global.me = null;
            setMyUserAction(null);
            await Helper.removeLocalValue(Constants.KEY_USERNAME);
            await Helper.removeLocalValue(Constants.KEY_PASSWORD);
            await Helper.removeLocalValue(Constants.KEY_USER);

            global._prevScreen = 'profile_edit';
            global.checkSignIn && global.checkSignIn();
            navigation.jumpTo('play');
          },
        },
  );

  return menu;
};

const menuIcon = (icon) => {
  if (icon == ic_support) {
    return '#D2D2D2';
  } else if (icon == ic_stars) {
    return 'white';
  } else {
    return 'none';
  }
};
class ProfileMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.scrollAnimatedValue = new Animated.Value(0);
    this.init();
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // Helper.setLightStatusBar();
      this.onRefresh();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  init = () => {
    this.state = {
      allViewCount: 0,
    };
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

  onBack = () => {
    this.props.navigation.goBack();
  };

  onPressProfile = () => {
    this.props.navigation.navigate('profile_edit');
  };

  render() {
    const { user, navigation, unreadCount } = this.props;
    const randomNumber = Math.floor(Math.random() * avatars.length);
    const randomImageUrl =
      'https://res.cloudinary.com/snaplist/image/upload/v1634327167/permanent/avatarFaces/1080xcorner_rsgs52.jpg';
    const avatarImage = {
      uri: user?.photo ?? randomImageUrl,
    };

    const displayName =
      user?.userType === 0 ? user?.displayName : user?.username;

    const translateY = this.scrollAnimatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: [0, -280],
      extrapolate: 'clamp',
    });

    const opacity = this.scrollAnimatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const topAnimatedStyle = [
      {
        transform: [{ translateY }],
        opacity,
      },
      styles.topContainer,
      user?.userType === 0 && { height: 280 },
    ];

    return (
      <View style={GStyles.container}>
        <StatusBar hidden />
        <View style={styles.container}>
          <Animated.View style={topAnimatedStyle}>
            <TouchableOpacity
              onPress={this.onPressProfile}
              style={{ ...GStyles.centerAlign, marginTop: 70 }}
            >
              <Avatar image={avatarImage} size={80} />
              <Text
                style={[
                  GStyles.newMediumText,
                  { marginTop: 16, textTransform: 'uppercase' },
                ]}
              >
                {displayName}
              </Text>
              <View style={{ flexShrink: 1, marginTop: 8, marginBottom: 30 }}>
                <Text
                  style={{ ...GStyles.newRegularText, color: GStyle.grayColor }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  ID: {user?.uniqueId}
                </Text>
              </View>
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  alignSelf: 'flex-start',
                  marginTop: 10,
                  marginBottom: 50,
                  alignSelf:
                    user?.isVerified && user?.isOfficial
                      ? 'flex-start'
                      : 'center',
                }}
              >
                {user?.isVerified && (
                  <View
                    style={{
                      height: 30,
                      width: '25%',
                      overflow: 'hidden',
                      backgroundColor: '#3AFA95',
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight:
                        user?.isVerified && user?.isOfficial ? 10 : 0,
                    }}
                  >
                    <Text style={[GStyles.elementLabel, styles.verified]}>
                      Verified
                    </Text>
                  </View>
                )}
                {user?.isOfficial && (
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#BB8323', '#F8F278', '#BB8323']}
                    style={styles.officialContainer}
                  >
                    <Text style={[GStyles.elementLabel, styles.official]}>
                      Official
                    </Text>
                  </LinearGradient>
                )}
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 20 }}>
              <Achievements
                opponentUser={user}
                showDiamond={true}
                check={true}
              />
            </View>
          </Animated.View>
          <Animated.ScrollView
            contentContainerStyle={[
              styles.scrollViewContainer,
              user?.userType === 0 && { paddingTop: 280 },
            ]}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { y: this.scrollAnimatedValue },
                  },
                },
              ],
              { useNativeDriver: true },
            )}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.teamsContainer}
                onPress={() => navigation.navigate('teams_screen')}
              >
                <Text style={styles.teamsItemText}>Teams</Text>
              </TouchableOpacity>
              {user?.userType === 1 ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('profile_check')}
                  style={styles.viewProfileContainer}
                >
                  <Text style={styles.teamsItemText}>View my profile</Text>
                </TouchableOpacity>
              ) : null}
              {getMenuItems(navigation, setMyUserAction).map((menu, index) => {
                if (user?.userType === 0 && menu.hideGuest) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={menu.onPress}
                    key={index.toString()}
                  >
                    {menu.icon == ic_sign ? (
                      <CachedImage
                        tintColor={menuIcon(menu.icon)}
                        source={menu.icon}
                        style={styles.menuIcon}
                      />
                    ) : null}
                    <View style={styles.menuRight}>
                      <Text
                        style={{
                          fontFamily: 'GothamPro',
                          color: GStyle.whiteColor,
                          fontSize: 16,
                          marginLeft:
                            menu.title == 'Artist Account' ||
                            menu.title == 'Guest Account'
                              ? 0
                              : -18,
                        }}
                      >
                        {menu.title}
                      </Text>
                      {unreadCount > 0 && menu.key === 'messages' && (
                        <View style={styles.messageBadgeContainer}>
                          <View style={styles.messageBadgeWrapper}>
                            <Text
                              style={[GStyles.textExtraSmall, GStyles.boldText]}
                            >
                              {unreadCount}
                            </Text>
                          </View>
                        </View>
                      )}

                      <CachedImage
                        source={ic_chevron_right}
                        style={styles.chevronRight}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#2A2B2F',
  },
  buttonFill: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: GStyle.activeColor,
    borderRadius: 12,
  },
  topContainer: {
    width: '100%',
    position: 'absolute',
    height: 300,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
  },
  textFill: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 13,
    textAlign: 'center',
    color: 'white',
  },
  detailContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  scrollViewContainer: {
    paddingTop: 320,
    paddingBottom: 120,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    marginLeft: 24,
  },
  menuIcon: {
    width: 32,
    height: 28,
    resizeMode: 'contain',
  },
  chevronRight: {
    width: 5.5,
    height: 9.62,
  },
  messageBadgeContainer: {
    flex: 1,
    ...GStyles.rowEndContainer,
    marginRight: 12,
  },
  messageBadgeWrapper: {
    backgroundColor: 'red',
    borderRadius: 120,
    ...GStyles.centerAlign,
    width: 20,
    height: 20,
  },
  teamsContainer: {
    backgroundColor: '#36373B',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  teamsItemText: {
    ...GStyles.regularText,
    ...GStyles.boldText,
    color: '#D2D2D2',
  },
  verified: {
    borderColor: GStyle.greenColor,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  official: {
    borderColor: GStyle.greenColor,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
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
  viewProfileContainer: {
    backgroundColor: '#36373B',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
});

const TProfileMainScreen = (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <ProfileMainScreen {...props} navigation={navigation} route={route} />;
};

export default connect(
  (state) => ({
    user: state.me?.user || {},
    unreadCount: state?.message?.unreadCount || 0,
  }),
  { setMyUserAction },
)(TProfileMainScreen);
