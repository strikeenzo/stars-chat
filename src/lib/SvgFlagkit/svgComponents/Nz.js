import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const SvgNz = (props) => (
  <Svg viewBox="0 0 21 15" width={21} height={15} {...props}>
    <Defs>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="NZ_svg__a">
        <Stop stopColor="#FFF" offset="0%" />
        <Stop stopColor="#F0F0F0" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="NZ_svg__b">
        <Stop stopColor="#0A17A7" offset="0%" />
        <Stop stopColor="#030E88" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="NZ_svg__c">
        <Stop stopColor="#DB1E36" offset="0%" />
        <Stop stopColor="#D51931" offset="100%" />
      </LinearGradient>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path fill="url(#NZ_svg__a)" d="M0 0h21v15H0z" />
      <Path fill="url(#NZ_svg__b)" d="M0 0h21v15H0z" />
      <Path
        d="M3 3.23L-1.352-.5H.66L4.16 2h.697L9.5-.902V.25c0 .303-.167.627-.418.806L6 3.257v.513l3.137 2.69c.462.395.204 1.04-.387 1.04-.245 0-.545-.096-.75-.242L4.84 5h-.697L-.5 7.902v-1.66l3.5-2.5V3.23z"
        fill="url(#NZ_svg__a)"
        fillRule="nonzero"
      />
      <Path
        d="M3.5 3L0 0h.5L4 2.5h1L9 0v.25a.537.537 0 0 1-.208.399L5.5 3v1l3.312 2.839c.104.089.072.161-.062.161a.898.898 0 0 1-.458-.149L5 4.5H4L0 7v-.5L3.5 4V3z"
        fill="url(#NZ_svg__c)"
      />
      <Path
        d="M0 2.5v2h3.5v2.505c0 .273.214.495.505.495h.99a.496.496 0 0 0 .505-.495V4.5h3.51a.49.49 0 0 0 .49-.505v-.99a.495.495 0 0 0-.49-.505H5.5V0h-2v2.5H0z"
        fill="url(#NZ_svg__a)"
      />
      <Path fill="url(#NZ_svg__c)" d="M0 3h4V0h1v3h4v1H5v3H4V4H0z" />
      <Path
        fill="#CA1931"
        d="M15 13l-.707.207.207-.707-.207-.707L15 12l.707-.207-.207.707.207.707zM15 3.5l-.707.207L14.5 3l-.207-.707L15 2.5l.707-.207L15.5 3l.207.707zM18 6.5l-.707.207L17.5 6l-.207-.707L18 5.5l.707-.207L18.5 6l.207.707zM12 7.5l-.707.207L11.5 7l-.207-.707L12 6.5l.707-.207L12.5 7l.207.707z"
      />
    </G>
  </Svg>
);

export default SvgNz;
