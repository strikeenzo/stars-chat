import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';

import { GStyles } from '../../utils/Global';
import Avatar from './Avatar';
import avatars from '../../assets/avatars';
import GStyle from '../../utils/Global/Styles';
import CachedImage from '../CachedImage';

const ic_diamond = require('../../assets/images/Icons/ic_diamond.png');
const ic_rank_first = require('../../assets/images/Icons/ic_rank_first.png');
const ic_rank_second = require('../../assets/images/Icons/ic_rank_second.png');
const ic_rank_third = require('../../assets/images/Icons/ic_rank_third.png');
const ic_flame = require('../../assets/images/Icons/ic_flame.png');
const firstTrophy = require('../../assets/images/Icons/Gold.png');
const secondTrophy = require('../../assets/images/Icons/Silver.png');
const thirdTrophy = require('../../assets/images/Icons/Bronze.png');

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = 'https://res.cloudinary.com/snaplist/image/upload/v1634327167/permanent/avatarFaces/1080xcorner_rsgs52.jpg';
const width = Dimensions.get('window').width;

const numberMark = (index) => {
 
    return <Text style={{ ...GStyles.arizoniaText }}>{index + 1}</Text>;
  
};

const TopUserItem = ({ index, item, onPress, sortBy = 'elixir' }) => {
  const icon = sortBy === 'elixir' ? ic_flame : ic_diamond;
  const iconText =
    sortBy === 'elixir' ? item?.elixirFlame || 0 : item?.diamondSpent || 0;
  const displayName = item?.userType === 0 ? item?.displayName : item?.username;

  const container = {
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    backgroundColor: '#1D1E20',
    paddingHorizontal: 16,
    
  }

  let elixirFlames;
  if (Number(iconText) >= 10000) {
    elixirFlames = `${Math.trunc(iconText / 1000)}K`
  } else {
    elixirFlames = iconText;
  }
  let trophy;
  if (index == 0) {
    trophy = firstTrophy;
  } else if (index == 1) {
    trophy = secondTrophy;
  } else if (index == 2) {
    trophy = thirdTrophy;
  } else {
    trophy = null
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(item);
      }}
    >
      <View style={[GStyles.rowCenterContainer, container]}>
        <View style={{ width: 36,height: 36, ...GStyles.newCenterAlign }}>
          {numberMark(index)}
        </View>

        <Avatar
        size={50}
          image={{ uri: item.photo || randomImageUrl }}
          containerStyle={{ marginLeft: 16 }}
        />
        <View style={styles.detailWrapper}>
          <Text
            style={[
              GStyles.newMediumText,
              GStyles.boldText,
              GStyles.upperCaseText,
              {fontSize: 14}
            ]}
          >
            {displayName}
          </Text>
          <View style={[GStyles.rowContainer, { marginTop: 2 }]}>
            {/* <CachedImage
              source={icon}
              style={{ width: 16, height: 16, marginRight: 4 }}
              resizeMode="contain"
            /> */}
            <Text style={[GStyles.regularText, { color: '#D2D2D2' }]}>
              {elixirFlames}
            </Text>
          </View>
        </View>
        {/* {trophy ? <View style={{right: -width * .065}}><CachedImage source={trophy} style={{ width: 70, height: 70}} /></View> : null} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  detailWrapper: {
    flex: 1,
    marginLeft: 12,
  },
});

export default TopUserItem;
