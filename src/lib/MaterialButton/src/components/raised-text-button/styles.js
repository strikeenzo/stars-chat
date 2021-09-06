import { Platform, StyleSheet } from 'react-native';
import RN from 'react-native/package.json';

let style = {};
let [, major, minor] = RN.version.match(/^(\d+)\.(\d+)\.(.+)$/);

if (Platform.OS === 'android') {
  style.textAlignVertical = 'center';

  if (!major && minor >= 40) {
    style.includeFontPadding = false;
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    textTransform: 'uppercase',

    backgroundColor: 'transparent',

    fontSize: 14,
    fontWeight: '500',

    ...style,
  },
});

export { styles };
