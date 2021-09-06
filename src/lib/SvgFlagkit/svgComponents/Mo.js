import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const SvgMo = (props) => (
  <Svg viewBox="0 0 21 15" width={21} height={15} {...props}>
    <Defs>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="MO_svg__a">
        <Stop stopColor="#FFF" offset="0%" />
        <Stop stopColor="#F0F0F0" offset="100%" />
      </LinearGradient>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="MO_svg__b">
        <Stop stopColor="#079D7B" offset="0%" />
        <Stop stopColor="#01795E" offset="100%" />
      </LinearGradient>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path fill="url(#MO_svg__a)" d="M0 0h21v15H0z" />
      <Path fill="url(#MO_svg__b)" d="M0 0h21v15H0z" />
      <Path
        d="M2.452 6.902c.143.038.284.07.423.098H.5c.119.356.278.691.473 1h7.054c.195-.309.354-.644.473-1H6.093c.143-.027.289-.059.437-.097C6.076 6.918 5.336 7 4.5 7c-.847 0-1.596-.084-2.048-.098zm-.417-.125C.915 6.398.146 5.792.267 5.34c.134-.503 1.325-.62 2.659-.263.07.018.139.038.206.059a4.342 4.342 0 0 1-.046-.637C3.086 3.12 3.72 2 4.5 2c.78 0 1.414 1.12 1.414 2.5 0 .219-.016.431-.046.634.077-.024.155-.047.234-.068 1.334-.357 2.524-.24 2.659.264.122.454-.66 1.067-1.797 1.445C6.764 6.18 5.737 6 4.5 6c-1.238 0-2.266.18-2.465.777zM7.166 9c-.728.625-1.656 1-2.666 1a4.076 4.076 0 0 1-2.666-1h5.332z"
        fill="url(#MO_svg__a)"
        transform="translate(6 2)"
      />
      <Path
        d="M10.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-4 2.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm8 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM13 4a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM8 4a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"
        fill="#FCD117"
      />
    </G>
  </Svg>
);

export default SvgMo;
