import * as React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  TextInput,
  componentDidMount
} from 'react-native';

// Utils
import { getLocationId, getWeather, getHumid, getTemp, getTimestamp, getNextTemp,getPreTemp } from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import getIconForWeather from './utils/getIconForWeather';

// Search component
import SearchInput from './SearchInput';

// MomentJS
import moment from 'moment';

// CLASS
export default class App extends React.Component {
  constructor(props) {
    super(props);

    // bind SCOPE
    this.handleDate = this.handleDate.bind(this);

    // STATE
    this.state = {
      loading: false,
      error: false,

      location: '',
      temperature: 0,
      humidity: 0,
      weather: '',
      time: '',
      nextTemp: '',
      predictedTemp: '',
      // Temperature: 0 ,Humidity: 0, Timestamp: '',
    };

  }
  // Life cycle
  componentDidMount() {
    this.timerID = setInterval(
      () => this.handleUpdate('30.1'),
      10000
    );
    this.timerID2 = setInterval(
      () => this.render(),
      10000
    );
  }

  // Parse of date
  handleDate = date => moment(date).format("hh:mm:ss");

  // Update current location
  handleUpdate = async (curTemp) => {
    if (!curTemp) return;

    this.setState({ loading: true }, async () => {
      try {

        const ID = await getLocationId('london');
        const { location, weather, temperature, humidity, time } = await getWeather(44418);
        const Humidity = await getHumid();
        const Temperature = await getTemp();
        const Timestamp = await getTimestamp();
        const nextTemp = await getNextTemp();
        const customPredictedTemp = await getPreTemp(curTemp);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature: Temperature,
          humidity: Humidity,
          time: Timestamp,
          nextTemp: nextTemp, //thay bằng predict
          custompredictedTemp: customPredictedTemp,
          //Temperature ,Humidity, Timestamp
        });


      } catch (e) {

        this.setState({
          loading: false,
          error: false,
        });

      }
    });
  };


  // RENDERING
  render() {

    // GET values of state
    const { loading, error, weather, temperature, humidity, time, nextTemp ,custompredictedTemp} = this.state;

    // Activity
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >

          <View style={styles.detailsContainer}>

            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    😞 Không load được dữ liệu...
                  </Text>
                )}
                {!error && (
                  <View>
                    {/* <Text style={[styles.largeText, styles.textStyle]}>
                      {getIconForWeather(weather)} {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                       {weather}
                    </Text> */}
                    
                    <Text style={[styles.largeText,styles.textStyle]}>
                    Tp Hồ Chí Minh
                    </Text>

                    <Text style={[styles.smallText, styles.textStyle]}>
                      Nhiệt độ:
                    </Text>
                    <Text>
                      <Text style={[styles.largeText, styles.textStyle]}>
                      🌡️{`${temperature}°`}
                      
                      </Text>
                    </Text>
                      
                      <Text style={[styles.smallText, styles.textStyle]}>
                      Dự đoán Nhiệt độ:
                      </Text>
                      
                      <Text style={[styles.largeText, styles.textStyle]}>
                      🌡️{`${Math.round(nextTemp * 10) / 10}°`}
                      </Text>

                      {/* độ ẩm */}
                    <Text style={[styles.smallText, styles.textStyle]}>
                    Độ ẩm:
                    </Text>
                    <Text>
                      <Text style={[styles.largeText, styles.textStyle]}>
                      💦{`${humidity}%`}
                      </Text>
                    </Text>
                    
                    <Text style={[styles.smallText, styles.textStyle]}>
                      Thời gian:
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {time}
                    </Text>
                  </View>
                  
                )}
                <Text style={[styles.smallText, styles.textStyle]}></Text>
                {
                  <View style={[styles.border]}>
                  <Text style={[styles.smallText, styles.textStyle]}></Text>
                <SearchInput
                  placeholder="Nhập nhiệt độ..."
                  onSubmit={this.handleUpdate}
                />
               
               <Text style={[styles.smallText, styles.textStyle]}>
                    Nhiệt độ dự đoán: {`${Math.round(custompredictedTemp * 10) / 10}°C`}
                      </Text>
                  
                 
                      <Text style={[styles.smallText, styles.textStyle]}></Text>
                  </View>
                }
            

                {/* {!error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Last update: {this.handleDate(created)}
                  </Text>
                )} */}

              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  border: {
    borderBottomColor: 'white',
    borderBottomWidth: 3,
    borderTopColor: 'white',
    borderTopWidth:3,
  },
  location:{
    textAlign: 'left',
  }
});