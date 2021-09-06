import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const SvgSt = (props) => (
  <Svg viewBox="0 0 21 15" width={21} height={15} {...props}>
    <Defs>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ST_svg__a">
        <Stop stopColor="#FFF" offset="0%" />
        <Stop stopColor="#F0F0F0" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ST_svg__b">
        <Stop stopColor="#2ACB41" offset="0%" />
        <Stop stopColor="#21AC35" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ST_svg__c">
        <Stop stopColor="#FDD043" offset="0%" />
        <Stop stopColor="#FFCD2F" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ST_svg__d">
        <Stop stopColor="#E71E43" offset="0%" />
        <Stop stopColor="#D01739" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ST_svg__e">
        <Stop stopColor="#262626" offset="0%" />
        <Stop stopColor="#0D0D0D" offset="100%" />
      </LinearGradient>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path fill="url(#ST_svg__a)" d="M0 0h21v15H0z" />
      <Path fill="url(#ST_svg__b)" d="M0 10h21v5H0zM0 0h21v5H0z" />
      <Path fill="url(#ST_svg__c)" d="M0 5h21v5H0z" />
      <Path fill="url(#ST_svg__d)" d="M0 0l8 7.5L0 15z" />
      <Path
        fill="url(#ST_svg__e)"
        d="M11 8.32l-1.176.798.396-1.365-1.122-.871 1.42-.045L11 5.5l.482 1.337 1.42.045-1.122.871.396 1.365zM16 8.32l-1.176.798.396-1.365-1.122-.871 1.42-.045L16 5.5l.482 1.337 1.42.045-1.122.871.396 1.365z"
      />
    </G>
  </Svg>
);

export default SvgSt;
