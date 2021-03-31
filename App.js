import React, {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const App = () => {
  //---------------State---------------------

  const [image, setImage] = useState(null);
  const [images, setImages] = useState(null);

  //------------------End State--------------

  const pickSingleWithCamera = (cropping, mediaType = 'photo') => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 200,
      height: 200,
      includeExif: true,
      mediaType,
    })
      .then(image => {
        console.log('received image', image);
        setImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        });
        setImages(null);
      })
      .catch(e => alert(e));
  };

  const pickSingle = (cropit, circular = false, mediaType) => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then(image => {
        console.log('received image', image);
        setImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        });
        setImages(null);
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  };

  const cropLast = () => {
    if (!image) {
      return Alert.alert(
        'No image',
        'Before open cropping only, please select image',
      );
    }

    ImagePicker.openCropper({
      path: image.uri,
      width: 200,
      height: 200,
    })
      .then(image => {
        console.log('received cropped image', image);
        setImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        });
        setImages(null);
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  };

  const pickSingleBase64 = cropit => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true,
    })
      .then(image => {
        console.log('received base64 image');
        setImage({
          uri: `data:${image.mime};base64,` + image.data,
          width: image.width,
          height: image.height,
        });
        setImages(null);
      })
      .catch(e => alert(e));
  };

  const pickMultiple = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      includeExif: true,
      forceJpg: true,
    })
      .then(images => {
        setImage(null);
        setImages(
          images.map(i => {
            console.log('received image', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        );
      })
      .catch(e => alert(e));
  };

  const cleanupImages = () => {
    ImagePicker.clean()
      .then(() => {
        console.log('removed tmp images from tmp directory');
        setImage(null);
        setImages(null);
      })
      .catch(e => {
        alert(e);
      });
  };

  const cleanupSingleImage = () => {
    let img = image || (images && images.length ? images[0] : null);
    console.log('will cleanup image', img);

    ImagePicker.cleanSingle(img ? img.uri : null)
      .then(() => {
        console.log(`removed tmp image ${img.uri} from tmp directory`);
        setImage(null);
      })
      .catch(e => {
        alert(e);
      });
  };
  const renderAsset = image => {
    return renderImage(image);
  };

  const renderImage = image => {
    return (
      <TouchableOpacity
        onPress={() => {
          alert(image.uri);
        }}>
        <Image
          style={{width: 200, height: 200, resizeMode: 'contain'}}
          source={image}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Welcome</Text>
      <ScrollView horizontal={true}>
        {image ? renderAsset(image) : null}
        {images
          ? images.map(i => <View key={i.uri}>{renderAsset(i)}</View>)
          : null}
      </ScrollView>
      {/* Select single Imaage With camera */}
      <TouchableOpacity
        onPress={() => pickSingleWithCamera(false)}
        style={styles.button}>
        <Text style={styles.text}>Select Single Image With Camera</Text>
      </TouchableOpacity>

      {/* Select single camera with cropping */}
      <TouchableOpacity
        onPress={() => pickSingleWithCamera(true)}
        style={styles.button}>
        <Text style={styles.text}>Select Single With Camera With Cropping</Text>
      </TouchableOpacity>

      {/* Select Single */}
      <TouchableOpacity onPress={() => pickSingle(false)} style={styles.button}>
        <Text style={styles.text}>Select Single</Text>
      </TouchableOpacity>

      {/* Select Single with cropping */}
      <TouchableOpacity onPress={() => pickSingle(true)} style={styles.button}>
        <Text style={styles.text}>Select Single With Cropping</Text>
      </TouchableOpacity>

      {/* Crop Last Selected Image */}
      <TouchableOpacity onPress={() => cropLast()} style={styles.button}>
        <Text style={styles.text}>Crop Last Selected Image</Text>
      </TouchableOpacity>

      {/* Select Single Returning Base64 */}
      <TouchableOpacity
        onPress={() => pickSingleBase64(false)}
        style={styles.button}>
        <Text style={styles.text}>Select Single Returning Base64</Text>
      </TouchableOpacity>

      {/* Select Single With Circular Cropping */}
      <TouchableOpacity
        onPress={() => pickSingle(true, true)}
        style={styles.button}>
        <Text style={styles.text}>Select Single With Circular Cropping</Text>
      </TouchableOpacity>

      {/* Select Multiple */}
      <TouchableOpacity onPress={() => pickMultiple()} style={styles.button}>
        <Text style={styles.text}>Select Multiple</Text>
      </TouchableOpacity>

      {/* Cleanup All Images */}
      <TouchableOpacity onPress={() => cleanupImages()} style={styles.button}>
        <Text style={styles.text}>Cleanup All Images</Text>
      </TouchableOpacity>

      {/* Cleanup Single Image */}
      <TouchableOpacity onPress={cleanupSingleImage} style={styles.button}>
        <Text style={styles.text}>Cleanup Single Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 30,
    width: 340,
    backgroundColor: 'aqua',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
  },
});

export default App;
