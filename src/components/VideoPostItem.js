import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import IconAnt from 'react-native-vector-icons/AntDesign';

const VideoPostItem = ({ index, item, onPressPost, searchTerm, length, count}) => {
    const width = Dimensions.get('window').width;

    function convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat)
        let date =  [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()];
        let month = date[1] -1;
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
     return `${date[0]} ${months[month]} ${date[2]}`  
    }
  return (
    <TouchableOpacity  onPress={() =>
      onPressPost(item.id)
    }>
      <View style={styles.row}>
        <View
          style={{
            height: width * .2,
            width: width * .15,
            alignItems: "center",
            justifyContent: "center",
          }}
         
        >
          <Image
            style={styles.poster}
            source={{ uri: item.thumb || '' }}
          />
        </View>
        <View style={styles.titleContainer}>
        {searchTerm == '0' ?<Text style={styles.number}>{`episode ${count - index}`}</Text> : null}
          {searchTerm == '0' ? <Text numberOfLines={1} style={styles.title}>{item.title}</Text>: <Text numberOfLines={1} style={styles.title}>{item.category.title}</Text> }
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>{searchTerm == '0' ? convertDate(item.createdAt) : ` ৳ ${item.price}`}</Text>

        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  poster: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    resizeMode: "cover",
    borderRadius: 3,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center'
  },
  plot: {
    color: "#696969",
  },
  title: {
    color: "#D2D2D2",
    fontSize: 14,
    fontWeight: 'bold'
  },
  description: {
    color: "#D2D2D2",
    fontSize: 10,
  },
  number: {
    color: "darkgrey",
    fontSize: 12,
  },
  date: {
    color: "#D2D2D2",
    fontSize: 10,
  },
});
export default VideoPostItem;
