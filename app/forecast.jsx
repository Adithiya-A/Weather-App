import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiCall } from '../src/config';

const ForecastScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = React.useState('daily');
  const [forecastData, setForecastData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [city, setCity] = React.useState('London'); // Default city

  React.useEffect(() => {
    if (route?.params?.city) {
      setCity(route.params.city);
      fetchForecast(route.params.city);
    } else {
      fetchForecast(city);
    }
  }, [route?.params?.city]);

  const fetchForecast = async (cityName) => {
    setLoading(true);
    try {
      const data = await apiCall(`/api/forecast/${encodeURIComponent(cityName)}`);
      
      // Group forecast data by day
      const groupedForecast = groupForecastByDay(data.forecast);
      setForecastData(groupedForecast);
      setCity(data.city);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      Alert.alert('Error', 'Failed to fetch forecast data. Please check your connection and make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const groupForecastByDay = (forecastList) => {
    const grouped = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    forecastList.forEach(item => {
      const date = new Date(item.date);
      const dayKey = date.toDateString();
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          day: days[date.getDay()],
          date: date.toDateString(),
          forecasts: []
        };
      }
      
      grouped[dayKey].forecasts.push({
        time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: item.temperature,
        condition: item.description,
        humidity: item.humidity,
        windSpeed: item.windSpeed,
        icon: getWeatherIcon(item.description)
      });
    });
    
    return Object.values(grouped).slice(0, 7); // Limit to 7 days
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return 'sunny';
    if (desc.includes('cloud')) return 'cloud';
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rainy';
    if (desc.includes('snow')) return 'snow';
    if (desc.includes('storm') || desc.includes('thunder')) return 'thunderstorm';
    return 'partly-sunny';
  };

  const ForecastItem = ({ dayData }) => (
    <View style={styles.forecastItem}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{dayData.day}</Text>
        <Text style={styles.dateText}>{new Date(dayData.date).toLocaleDateString()}</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyForecast}>
        {dayData.forecasts.map((forecast, index) => (
          <View key={index} style={styles.hourlyItem}>
            <Text style={styles.timeText}>{forecast.time}</Text>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={getWeatherIcon(forecast.condition)} 
                size={20} 
                color="#fff" 
              />
            </View>
            <Text style={styles.tempText}>{forecast.temperature}°</Text>
            <Text style={styles.conditionText}>{forecast.condition}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Forecast</Text>
          <Text style={styles.cityName}>{city}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'hourly' && styles.activeTab]}
          onPress={() => setActiveTab('hourly')}
        >
          <Text style={[styles.tabText, activeTab === 'hourly' && styles.activeTabText]}>
            Hourly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => setActiveTab('daily')}
        >
          <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
            Daily
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.forecastList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading forecast...</Text>
          </View>
        ) : forecastData.length > 0 ? (
          forecastData.map((dayData, index) => (
            <ForecastItem key={index} dayData={dayData} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline" size={60} color="#666" />
            <Text style={styles.emptyText}>No forecast data available</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.navText}>Forecast</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#fff',
  },
  forecastList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  forecastItem: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#999',
  },
  hourlyForecast: {
    marginTop: 8,
  },
  hourlyItem: {
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#3A3A3A',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tempText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  conditionText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  cityName: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
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

export default ForecastScreen;
