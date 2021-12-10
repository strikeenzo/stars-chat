import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  TouchableNativeFeedback,
  Text,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { GStyles } from '../../utils/Global';
import HomeVideoScreen from './HomeVideoScreen';
import CachedImage from '../../components/CachedImage';
import SearchBarItem from '../../components/elements/SearchBarItem';

const height = Dimensions.get('window').height;
const searchBarHeight = height > 750 ? 110 : 80;
const searchBarMargin = height > 750 ? 30 : 0;
const ic_back = require('../../assets/images/Icons/ic_back.png');

class HomeMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    /* this.unsubscribe = this.props.navigation.addListener('focus', () => {
      Helper.setLightStatusBar();
    }); */
  }

  /* componentWillUnmount() {
    this.unsubscribe();
  } */

  init = () => {
    this.state = {
      isFetching: false,
      searchText: '',
    };
  };

  onSubmitSearchText = () => {
    Keyboard.dismiss();

    if (this.usersListRef) {
      this.usersListRef.scrollToTop();
    }
    if (this.videosListRef) {
      this.videosListRef.scrollToTop();
    }

    const { searchText } = this.state;

    const lastTyped = searchText.charAt(searchText.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];

    let keyword = '';
    if (searchText.length > 0) {
      if (parseWhen.indexOf(lastTyped) > -1) {
        keyword = searchText.slice(0, searchText.length - 1);
      } else {
        keyword = searchText;
      }
    } else {
      keyword = '';
    }
    this.setState({ searchText: keyword });
    const { navigation } = this.props;
    navigation.navigate('home_search', { searchText: searchText });
    this.setState({ searchText: '' });
  };
  onBack = () => {
    this.props.navigation.goBack();
  };

  onChangeSearchText = (text) => {
    const { searchText } = this.state;

    if (searchText.length < 1 && text.length > 1) {
      return;
    }

    const parseWhen = [',', ' ', ';', '\n'];

    if (text.length === 1) {
      if (parseWhen.indexOf(text.charAt(0)) > -1) {
        return;
      }
    }
    if (text.length > 1) {
      if (
        parseWhen.indexOf(text.charAt(text.length - 1)) > -1 &&
        parseWhen.indexOf(text.charAt(text.length - 2)) > -1
      ) {
        return;
      }
    }

    this.setState({ searchText: text });
  };
  _renderSearch = () => {
    const { searchText } = this.state;

    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 16,
          backgroundColor: '#35393F',
          height: searchBarHeight,
        }}
      >
        <TouchableOpacity onPress={this.onBack} style={GStyles.centerAlign}>
          <CachedImage
            tintColor="#D2D2D2"
            source={ic_back}
            style={{ width: 18, height: 18, marginTop: searchBarMargin }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginVertical: 4,
            marginHorizontal: 8,
            marginTop: searchBarMargin,
          }}
        >
          <SearchBarItem
            searchText={searchText}
            onChangeText={this.onChangeSearchText}
            onSubmitText={this.onSubmitSearchText}
          />
        </View>
        <View style={{ ...GStyles.centerAlign, marginRight: 12 }}>
          <TouchableNativeFeedback
            onPress={this.onSubmitSearchText}
            style={{ ...GStyles.centerAlign, height: 50 }}
          >
            <Text
              style={{
                ...GStyles.regularText,
                color: '#D2D2D2',
                marginTop: searchBarMargin,
              }}
            >
              Search
            </Text>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  };
  onPressSearch = () => {
    const { navigation } = this.props;
    navigation.navigate('home_search');
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#2A2B2F' }}>
        <View>{this._renderSearch()}</View>
        <HomeVideoScreen navigation={this.props.navigation} />
      </View>
    );
  }
}

const THomeMainScreen = (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <HomeMainScreen {...props} navigation={navigation} route={route} />;
};

export default THomeMainScreen;
