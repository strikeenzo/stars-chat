import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import { Constants, Helper, RestAPI } from '../../utils/Global';
import GStyle, { GStyles } from '../../utils/Global/Styles';
import ProductsList from '../../components/elements/ProductsList';
import Avatar from '../../components/elements/Avatar';
import PostItem from '../../components/elements/PostItem';

const HomeVideoScreen = (props) => {
  const { category } = props;
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [onEndReachedDuringMomentum, setOnEndReachedDuringMomentum] = useState(
    true,
  );

  const getSelectedTopUsers = () => {
    RestAPI.get_all_users({}, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200) {
          const profiles = json.data.userList.filter((user) => user?.isTopUser);
          const shuffled = profiles.sort(() => 0.5 - Math.random());
          const filteredItems = shuffled.slice(0, 5);

          setTopUsers(filteredItems);
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };
  useEffect(() => {
    onRefresh('init');
  }, [currentSubCategory]);

  useEffect(() => {
    getSelectedTopUsers();
  }, []);

  const onRefresh = (type) => {
    if (isFetching) {
      return;
    }

    const newPage = type === 'more' ? curPage + 1 : 1;
    setCurPage(newPage);
    if (type === 'more') {
      const maxPage =
        (totalCount + Constants.COUNT_PER_PAGE - 1) / Constants.COUNT_PER_PAGE;
      if (newPage > maxPage) {
        return;
      }
    }
    setCurPage(newPage);

    if (type === 'init') {
      //global.showForcePageLoader(true);
      setIsFetching(true);
    } else {
      setIsFetching(true);
    }
    let params = {
      userId: global.me ? global.me?.id : '',
      page: type === 'more' ? newPage : '1',
      amount: Constants.COUNT_PER_PAGE,
    };
    RestAPI.get_all_post_list(params, (json, err) => {
      global.showForcePageLoader(false);
      setIsFetching(false);

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          setTotalCount(json.data.totalCount || 0);
          if (type === 'more') {
            let data = posts.concat(json.data.postList || []);
            setPosts(data);
          } else {
            setPosts(json.data.postList || []);
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  const onPressVideo = (item) => {
    global._selIndex = posts.findIndex((obj) => obj.id === item?.id);
    global._postsList = posts;
    global._prevScreen = 'home_main_video';
    const pushAction = StackActions.push('post_detail', null);
    props.navigation.dispatch(pushAction);
  };

  const renderItem = ({ item, index }) => {
    return <PostItem item={item} onPress={onPressVideo} index={index} />;
  };

  const _renderVideo = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.avatars}>
          {topUsers.map((item) => (
            <Avatar
              size={60}
              key={item.id}
              image={{ uri: item?.photo }}
              onPress={() => onPressUser(item)}
            />
          ))}
        </View>
        <Text style={styles.recentTextLabel}>Recently watched</Text>
        {posts?.length ? (
          <ProductsList
            products={posts}
            ref={flatListRef}
            onRefresh={onRefresh}
            isFetching={isFetching}
            renderItem={renderItem}
            onEndReachedDuringMomentum={onEndReachedDuringMomentum}
            setOnEndReachedDuringMomentum={setOnEndReachedDuringMomentum}
          />
        ) : (
          <View style={{ flex: 1, ...GStyles.centerAlign }}>
            <Text style={GStyles.notifyDescription}>
              {isFetching ? '' : 'Not found.'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  const onPressUser = (item) => {
    if (global.me) {
      if (item.id === global.me?.id) {
        navigation.jumpTo('profile');
      } else {
        global._opponentUser = item;
        global._prevScreen = 'top_users';
        navigation.navigate('profile_other');
      }
    } else {
      navigation.navigate('signin');
    }
  };

  const onPressSubCategory = (subCategory) => {
    setCurrentSubCategory(subCategory);
  };

  const _renderSubCategories = () => {
    const subCategories = category?.subCategories || [];

    return (
      <View style={styles.subCategoriesContainer}>
        {subCategories.map((subCategory, index) => {
          const selected = currentSubCategory?.id === subCategory?.id;
          return (
            <TouchableOpacity
              style={[
                styles.subCategoryButton,
                selected && { backgroundColor: GStyle.activeColor },
              ]}
              key={index.toString()}
              onPress={() => onPressSubCategory(subCategory)}
            >
              <Text
                style={[styles.subCategoryText, selected && { color: 'white' }]}
              >
                {subCategory.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {_renderSubCategories()}
        {_renderVideo()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subCategoriesContainer: {
    padding: 10,
    ...GStyles.rowContainer,
    flexWrap: 'wrap',
  },
  subCategoryButton: {
    marginLeft: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    ...GStyles.centerAlign,
    backgroundColor: GStyle.grayBackColor,
    marginBottom: 6,
    borderRadius: 120,
  },
  subCategoryText: {
    ...GStyles.textSmall,
    color: GStyle.grayColor,
    ...GStyles.boldText,
  },
  avatars: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 10,
  },
  recentTextLabel: {
    ...GStyles.regularText,
    ...GStyles.boldText,
    color: '#D2D2D2',
    alignSelf: 'center',
    marginVertical: 12,
  },
});

export default HomeVideoScreen;
