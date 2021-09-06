import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const SvgSj = (props) => (
  <Svg viewBox="0 0 21 15" width={21} height={15} {...props}>
    <Defs>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="SJ_svg__a">
        <Stop stopColor="#FFF" offset="0%" />
        <Stop stopColor="#F0F0F0" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="SJ_svg__b">
        <Stop stopColor="#F14247" offset="0%" />
        <Stop stopColor="#ED2F35" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="SJ_svg__c">
        <Stop stopColor="#0A3A85" offset="0%" />
        <Stop stopColor="#032A67" offset="100%" />
      </LinearGradient>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path fill="url(#SJ_svg__a)" d="M0 0h21v15H0z" />
      <Path fill="url(#SJ_svg__b)" d="M0 0h21v15H0z" />
      <Path fill="url(#SJ_svg__a)" d="M0 9h6v6h3V9h12V6H9V0H6v6H0z" />
      <Path fill="url(#SJ_svg__c)" d="M0 8h7v7h1V8h13V7H8V0H7v7H0z" />
    </G>
  </Svg>
);

export default SvgSj;
