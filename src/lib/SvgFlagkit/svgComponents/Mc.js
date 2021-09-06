import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const SvgMc = (props) => (
  <Svg viewBox="0 0 21 15" width={21} height={15} {...props}>
    <Defs>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="MC_svg__a">
        <Stop stopColor="#FFF" offset="0%" />
        <Stop stopColor="#F0F0F0" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="MC_svg__b">
        <Stop stopColor="#EA233B" offset="0%" />
        <Stop stopColor="#CC162C" offset="100%" />
      </LinearGradient>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path fill="url(#MC_svg__a)" d="M0 0h21v15H0z" />
      <Path fill="url(#MC_svg__b)" d="M0 0h21v8H0z" />
      <Path fill="url(#MC_svg__a)" d="M0 8h21v7H0z" />
    </G>
  </Svg>
);

export default SvgMc;
