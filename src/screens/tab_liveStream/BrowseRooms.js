import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import LiveStreamRooms from './LiveStreamRooms';

import { GStyle } from '../../utils/Global';
import styles from './styles';

class BrowseRooms extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#2A2B2F'}]}>
        <ScrollableTabView
          initialPage={0}
          tabBarBackgroundColor="white"
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarInactiveTextColor={'black'}
          tabBarActiveTextColor='white'
          tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}
          style={{ flex: 1 }}
          renderTabBar={() => (
            <DefaultTabBar
              style={{
                borderWidth: 0,
                backgroundColor: '#35393F',
              }}
            />
          )}
        >
          <LiveStreamRooms tabLabel="Broadcasts" keyword={'popular'} />
        </ScrollableTabView>
      </View>
    );
  }
}

const THomeMainScreen = (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <BrowseRooms {...props} navigation={navigation} route={route} />;
};
export default THomeMainScreen;
