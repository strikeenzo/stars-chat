import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { GStyles } from '../../utils/Global';
import Avatar from './Avatar';
import avatars from '../../assets/avatars';

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = 'https://res.cloudinary.com/snaplist/image/upload/v1634327167/permanent/avatarFaces/1080xcorner_rsgs52.jpg';

const ExploreUserItem = ({ item, onPress }) => {
  const displayName = item?.userType === 0 ? item?.displayName : item?.username;

  return (
    <View style={{ alignItems: 'center', marginTop: 24 }}>
      <TouchableOpacity
        onPress={() => {
          onPress(item);
        }}
      >
        <View
          style={{ width: '88%', flexDirection: 'row', alignItems: 'center' }}
        >
          <Avatar
            image={{ uri: item.photo || randomImageUrl }}
            // status={item.opponent_status}
          />
          <View
            style={{
              marginLeft: 10,
              flex: 1,
            }}
          >
            <Text
              style={[
                GStyles.mediumText,
                GStyles.boldText,
                GStyles.upperCaseText,
                { marginHorizontal: 12, color: '#D2D2D2' },
              ]}
            >
              {displayName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ExploreUserItem;
