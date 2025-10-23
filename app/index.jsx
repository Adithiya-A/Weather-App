import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiCall } from '../src/config';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState('');
  const [searchedWeather, setSearchedWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setLoading(true);
    try {
      const data = await apiCall(`/api/weather/${encodeURIComponent(searchText)}`);
      
      setSearchedWeather({
        city: data.city,
        country: data.country,
        temperature: data.temperature,
        condition: data.description,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        pressure: data.pressure,
        visibility: data.visibility,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Failed to fetch weather data. Please check your connection and make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const WeatherCard = ({ weather }) => (
    <View style={styles.weatherCard}>
      <View style={styles.weatherHeader}>
        <View style={styles.weatherInfo}>
          <Text style={styles.cityName}>{weather.city}, {weather.country}</Text>
          <Text style={styles.temperature}>{weather.temperature}°C</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
          <Text style={styles.time}>{weather.time}</Text>
        </View>
        <View style={styles.weatherIcon}>
          <Ionicons name="partly-sunny" size={40} color="#fff" />
        </View>
      </View>
      
      <View style={styles.weatherDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={20} color="#999" />
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="leaf" size={20} color="#999" />
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} m/s</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="speedometer" size={20} color="#999" />
          <Text style={styles.detailLabel}>Pressure</Text>
          <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="eye" size={20} color="#999" />
          <Text style={styles.detailLabel}>Visibility</Text>
          <Text style={styles.detailValue}>{weather.visibility} km</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      <ScrollView style={styles.weatherList} showsVerticalScrollIndicator={false}>
        {searchedWeather && (
          <WeatherCard weather={searchedWeather} />
        )}
        {!searchedWeather && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={60} color="#666" />
            <Text style={styles.emptyText}>Search for a city to see weather</Text>
            <Text style={styles.emptySubtext}>Enter a city name above to get current weather information</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Forecast', { city: searchedWeather?.city || 'London' })}
        >
          <Ionicons name="calendar" size={24} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Forecast</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  weatherList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  weatherCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  weatherInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  weatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
    marginRight: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen;