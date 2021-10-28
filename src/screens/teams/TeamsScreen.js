import React from 'react';
import {  StyleSheet, Text, View, TextInput, StatusBar } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import { GStyle, GStyles, Helper, RestAPI } from '../../utils/Global';
import TeamTab from './TeamTab';
import GHeaderBar from '../../components/GHeaderBar';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import CachedImage from '../../components/CachedImage';
import formatNumber from '../../utils/Global/formatNumber';
import Icon from 'react-native-vector-icons/AntDesign'

const ic_flame = require('../../assets/images/Icons/ic_flame.png');

class TeamsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
   /*  this.unsubscribe = this.props.navigation.addListener('focus', () => {
      Helper.setLightStatusBar();
    }); */
    this.refreshTeams();
  }

/*   componentWillUnmount() {
    this.unsubscribe();
  } */

  init = () => {
    this.state = {
      isFetching: false,
      teams: [],
      term: ''
    };
  };

  refreshTeams = () => {
    const { isFetching } = this.state;
    if (isFetching) {
      return;
    }
    let params = {
      user_id: global.me ? global.me?.id : '',
    };
    //global.showForcePageLoader(true);
    RestAPI.get_teams(params, (json, error) => {
      this.setState({ isFetching: false });
      global.showForcePageLoader(false);

      if (error !== null) {
        Helper.alertNetworkError(error?.message);
      } else {
        if (json.status === 200) {
          const teams = json.data?.teams || [];
          this.setState({
            teams,
          });
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  _renderHeader = () => {
    return (
      <GHeaderBar
        headerTitle="Teams"
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };
 
  _search = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderRadius: 50,
          width: "90%",
          alignItems: "center",
          marginTop: 50,
          alignSelf: "center",
          marginBottom: 10,
          backgroundColor: '#35393F',
          marginBottom: 40
        }}
      >
        <Icon
          name="search1"
          size={25}
          color="white"
          style={{ marginLeft: 10 }}
        />
        <TextInput
        onChangeText={(newTerm)=> this.setState({term: newTerm})}
          placeholderTextColor="white"
          style={styles.textInput}
          placeholder="Search"
          autoCapitalize="none"
          autoCorrect={false}
          numberOfLines={1}
        />
      </View>
    )
  }

  render() {
    const { teams } = this.state;
    let newTeams = [];
    if (this.state.term) {
      newTeams = teams.filter(r => r.name.toLowerCase().includes(this.state.term))
    } else {
      newTeams = [...teams]
    }

    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: '#2A2B2F'}}>
        <StatusBar hidden />
        {this._renderHeader()}
        {this._search()}
        {newTeams?.length > 0 ? (newTeams.map((team, index) => (
            <TeamTab index={index} team={team} key={index.toString()} />
          ))) : this.state.term && newTeams?.length == 0 ? <Text style={[GStyles.newRegularText,{textAlign: 'center'}]}>No Teams Match Your Search</Text> : null}
          
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  tabBarTextStyle: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollBar: {
    borderWidth: 0,
    backgroundColor: 'white',
    flex: 1,
    marginRight: 16,
  },
  tabBar: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: GStyle.snowColor,
    borderRadius: 5,
    marginLeft: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    height: 50,
    paddingHorizontal: 10,
    color: "white",
  },
  iconStyle: {
    fontSize: 35,
    alignSelf: "center",
    marginHorizontal: 15,
  },
});

export default (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <TeamsScreen {...props} navigation={navigation} route={route} />;
};
