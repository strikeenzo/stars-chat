import { Text, View, Image } from 'react-native';
import { GStyles, Helper } from '../../utils/Global';
import React from 'react';
import icons from '../../assets/icons';
import CachedImage from '../CachedImage';

const Achievements = (props) => {
  const award = icons.award;
  const fans = icons.fans;
  const elixir = icons.elixir;
  const elixirFire = icons['elixir-fire'];
  const opponentUser = props.opponentUser;
  const lvl = Helper.getLvLGuest(opponentUser?.diamondSpent || 0);

  let lvls;
  if (Number(opponentUser.diamondSpent) >= 10000) {
    lvls = `${Math.trunc(opponentUser.diamondSpent / 1000)}K`;
  } else {
    lvls = opponentUser.diamondSpent;
  }

  let awards;
  if (Number(opponentUser.awards) >= 10000) {
    awards = `${Math.trunc(opponentUser.awards / 1000)}K`;
  } else {
    awards = opponentUser.awards;
  }

  let elixirFlames;
  if (Number(opponentUser.elixirFlame) >= 10000) {
    elixirFlames = `${Math.trunc(opponentUser.elixirFlame / 1000)}K`;
  } else {
    elixirFlames = opponentUser.elixirFlame;
  }

  let diamonds;
  if (Number(opponentUser.diamond) >= 10000) {
    diamonds = `${Math.trunc(opponentUser.diamond / 1000)}K`;
  } else {
    diamonds = opponentUser.diamond;
  }

  let elixirs;
  if (Number(opponentUser.elixir) >= 10000) {
    elixirs = `${Math.trunc(opponentUser.elixir / 1000)}K`;
  } else {
    elixirs = opponentUser.elixir;
  }

  let fan;
  if (Number(opponentUser.fansCount) >= 10000) {
    fan = `${Math.trunc(opponentUser.fansCount / 1000)}K`;
  } else {
    fan = opponentUser.fansCount;
  }
  return (
    <View style={[GStyles.rowEvenlyContainer, { width: '100%' }]}>
      {opponentUser?.userType === 1 ? (
        <>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.newRegularText, GStyles.boldText]}>
              {awards || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Awards</Text>
            {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={{uri: award}} style={{
                  width: 35,
                  height: 29,
                  resizeMode: 'contain',
                }}/>
            </View> */}
          </View>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.newRegularText, GStyles.boldText]}>
              {elixirs || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Elixir</Text>
            {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={{uri: award}} style={{
                  width: 35,
                  height: 29,
                  resizeMode: 'contain',
                }}/>
            </View> */}
          </View>
          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.newRegularText, GStyles.boldText]}>
              {elixirFlames || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Elixir Fire</Text>
            {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={{uri: elixirFire}} style={{
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}/>
            </View> */}
          </View>

          {props.check ? (
            <View style={GStyles.centerAlign}>
              <Text style={[GStyles.newRegularText, GStyles.boldText]}>
                {diamonds || 0}
              </Text>
              <Text style={GStyles.elementLabel}>Diamonds</Text>
              {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>

                <Image source={{uri: elixir}} style={{
                  width: 35,
                  height: 30,
                  resizeMode: 'contain',
                }}/>
              </View> */}
            </View>
          ) : null}

          <View style={GStyles.centerAlign}>
            <Text style={[GStyles.newRegularText, GStyles.boldText]}>
              {fan || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Fans</Text>
            {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={{uri: fans}} style={{
                  width: 26,
                  height: 23,
                  resizeMode: 'contain',
                }}/>
            </View> */}
          </View>
        </>
      ) : (
        <>
          <View style={GStyles.centerAlign}>
            <Text
              style={[
                GStyles.regularText,
                GStyles.boldText,
                { color: '#D2D2D2' },
              ]}
            >
              {diamonds || 0}
            </Text>
            <Text style={GStyles.elementLabel}>Diamonds</Text>
            {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={{uri: elixir}} style={{
                  width: 35,
                  height: 30,
                  resizeMode: 'contain',
                }}/>
            </View> */}
          </View>
          <View style={GStyles.centerAlign}>
            <Text
              style={[
                GStyles.regularText,
                GStyles.boldText,
                { color: '#D2D2D2' },
              ]}
            >
              {lvls || 0}
            </Text>
            <Text style={GStyles.elementLabel}>LvL</Text>
            {/* <View style={{width: 45, height: 40, backgroundColor: '#36393E', borderRadius: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}> 
           </View> */}
          </View>
        </>
      )}
    </View>
  );
};

export default Achievements;
