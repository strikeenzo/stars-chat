import React, {forwardRef} from 'react';
import {Text, View} from 'react-native';
import {StackActions, useNavigation, useRoute,} from '@react-navigation/native';

import {Constants, GStyles, Helper, RestAPI} from '../../utils/Global';
import ProductsList from '../../components/elements/ProductsList';
import PostItem from '../../components/elements/PostItem';

class HomeVideoSearch extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.setState({ keyword: this.props.keyword }, () => {
      this.onRefresh('init');
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.keyword !== this.props.keyword) {
      this.setState({ keyword: this.props.keyword }, () => {
        this.onRefresh('init');
      });
    }
  }

  init = () => {
    this.state = {
      isFetching: false,
      totalCount: 0,
      curPage: 1,
      keyword: '',
      itemDatas: [],

      minVisibleIndex: 0,
      maxVisibleIndex: 0,
      onEndReachedDuringMomentum: true,
    };
  };

  onRefresh = (type) => {
    let { isFetching, totalCount, curPage, itemDatas } = this.state;
    const { keyword } = this.props;

    if (isFetching) {
      return;
    }

    if (type === 'more') {
      curPage += 1;
      const maxPage =
        (totalCount + Constants.COUNT_PER_PAGE - 1) / Constants.COUNT_PER_PAGE;
      if (curPage > maxPage) {
        return;
      }
    } else {
      curPage = 1;
    }
    this.setState({ curPage });

    if (type === 'init') {
      //global.showForcePageLoader(true);
      this.setState({ isFetching: true });
    } else {
      this.setState({ isFetching: true });
    }
    let params = {
      user_id: global.me ? global.me?.id : '',
      page_number: type === 'more' ? curPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
      keyword,
    };
    RestAPI.get_searched_post_list(params, (json, err) => {
      global.showForcePageLoader(false);

      this.setState({ isFetching: false });

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          this.setState({ totalCount: json.data.totalCount });
          if (type === 'more') {
            let data = itemDatas.concat(json.data.postList);
            this.setState({ itemDatas: data });
          } else {
            this.setState({ itemDatas: json.data.postList });
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  scrollToTop = () => {
    this.flatListRef?.scrollToOffset({ animated: false, offset: 0 });
  };

  renderItem = ({ item, index }) => {
    return <PostItem item={item} onPress={this.onPressVideo} index={index} />;
  };

  onPressVideo = (item) => {
    const { itemDatas } = this.state;

    global._selIndex = itemDatas.findIndex((obj) => obj.id === item?.id);
    global._postsList = itemDatas;
    global._prevScreen = 'home_main_video';
    const pushAction = StackActions.push('post_detail', null);
    this.props.navigation.dispatch(pushAction);
  };

  render() {
    return (
      <>
        <View style={{ flex: 1 }}>{this._renderVideo()}</View>
      </>
    );
  }

  setOnEndReachedDuringMomentum = (onEndReachedDuringMomentum) => {
    this.setState({
      onEndReachedDuringMomentum,
    });
  };

  _renderVideo = () => {
    const { isFetching, itemDatas, onEndReachedDuringMomentum } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {itemDatas?.length ? (
          <ProductsList
            products={itemDatas}
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            onRefresh={this.onRefresh}
            renderItem={this.renderItem}
            isFetching={isFetching}
            onEndReachedDuringMomentum={onEndReachedDuringMomentum}
            setOnEndReachedDuringMomentum={this.setOnEndReachedDuringMomentum}
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
}

const THomeVideoSearch = forwardRef((props, ref) => {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <HomeVideoSearch
      ref={ref}
      {...props}
      navigation={navigation}
      route={route}
    />
  );
});

export default THomeVideoSearch;
