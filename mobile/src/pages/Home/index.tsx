import React, {useState, useEffect, useCallback} from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Select, { Item } from 'react-native-picker-select';

import ibge from '../../services/ibgeApi';

interface IBGEUfRes {
  sigla: string;
}

interface IBGECityRes {
  nome: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<Item[]>([]);
  const [cities, setCities] = useState<Item[]>([]);

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    ibge.get<IBGEUfRes[]>('/v1/localidades/estados').then((res) => {
      const ufInitials = res.data.map((uf) => {
        return {
          label: uf.sigla,
          value: uf.sigla,
        };
      })
        .sort((a, b) => {
          if (a.value > b.value) {
            return 1;
          }
          if (a.value < b.value) {
            return -1;
          }

          return 0;
        });

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (uf) {
      ibge
        .get<IBGECityRes[]>(`/v1/localidades/estados/${uf}/municipios`)
        .then((res) => {
          const citiesNames = res.data.map((city) => {
            return { label: city.nome, value: city.nome };
          });

          setCities(citiesNames);
        });
    }
  }, [uf]);

  const handleNavigateToPoints = useCallback(() => {
    navigation.navigate('Points', {
      uf,
      city,
    });
  }, [uf, city]);

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 272, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          

            <Select
              onValueChange={(value) =>setUf(value)}
              items={ufs}
              placeholder={{ label: 'Selecione o estado' }}
              style={{
                viewContainer: styles.select,
                placeholder: styles.selectText,
              }}
            />

            <Select
              onValueChange={(value) => setCity(value)}
              items={cities}
              placeholder={{ label: 'Selecione a cidade' }}
              style={{
                viewContainer: styles.select,
                placeholder: styles.selectText,
              }}
            />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" sze={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
        </Text>
          </RectButton>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },

  selectText: {
    fontSize: 16,
  },


  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;