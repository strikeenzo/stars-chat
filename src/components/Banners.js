import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Image, Flatlist, Image} from 'react-native'

const Banners = () => {
const [banners, setBanners] = useState([]);


// make call to fetch banners urls and update setBanners state with the result

const renderBanners = () => {
    if (!banners) {
        return null;
    } else {
        return (
            <FlatList
        horizontal
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity>
            <Image
              source={item.url}
              style={{
                width: 100,
                height: 100,
                borderRadius: 120,
                marginLeft: 20,
              }}
            />
          </TouchableOpacity>
        )}
      />
        )
    }
}

    return (
        <View style={styles.container}>
            {renderBanners()}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2A2B2F'
    }
})
export default Banners
