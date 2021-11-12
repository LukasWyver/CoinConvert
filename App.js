import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PickerSelect from ".//src/component/Picker";
import CoinImg from "./src/assets/coin.svg";
import api from "./src/services/api";

export default function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertCoinVisible, setAlertCoinVisible] = useState(false);

  const [coinSelected, setCoinSelected] = useState(null);
  const [coinValue, setCoinValue] = useState(0);

  const [valueCurrent, setValueCurrent] = useState(null);
  const [valueConverted, setValueConverted] = useState(0);

  useEffect(() => {
    async function loadCoin() {
      const response = await api.get("all");
      let arrayCoins = [];
      Object.keys(response.data).map((key) => {
        arrayCoins.push({
          key: key,
          label: key,
          value: key,
        });
      });

      setCoins(arrayCoins);
      setLoading(false);
    }
    loadCoin();
  }, []);

  async function convert() {
    if (coinSelected === null || coinValue === 0) {
      setAlertCoinVisible(true);
      return;
    }
    // ele devolveu quanto é a moeda seleciona convertida 1x1 para Reais
    const response = await api.get(`all/${coinSelected}-BRL`);
    let resultado = response.data[coinSelected].ask * parseFloat(coinValue);
    setValueConverted(`R$ ${resultado.toFixed(2)}`);
    setValueCurrent(coinValue);
    // aqui ele fecha o teclado caso estaja aberto.
    Keyboard.dismiss();
  }

  function alertCoin() {
    if (alertCoinVisible) {
      return (
        <View style={styles.valueResults}>
          <Text style={styles.nullValue}>
            " Você ainda não preencheu tudo... 😥 "
          </Text>
        </View>
      );
    } else {
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#80ED99" size={96} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.img}>
          <CoinImg width={160} height={160} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Selecione uma moeda:</Text>
          <PickerSelect
            coins={coins}
            onChange={(coin) => setCoinSelected(coin)}
          />
        </View>

        <View style={styles.coin}>
          <Text style={styles.title}>
            Digite um valor para converter em (R$)
          </Text>
          <TextInput
            placeholder="Ex: R$ 50,00"
            placeholderTextColor="#d1d1d1"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => setCoinValue(value)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={convert}>
          <Text style={styles.btnText}>Converter</Text>
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>

        {valueConverted !== 0 ? (
          <View style={styles.valueResults}>
            <Text style={styles.value}>
              {valueCurrent} {coinSelected}
            </Text>
            <Text style={[styles.value, styles.valueText]}>corresponde a:</Text>
            <Text style={styles.value}>{valueConverted}</Text>
          </View>
        ) : (
          alertCoin()
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#191919",
    paddingTop: 16,
  },
  img: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
  },
  header: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    paddingTop: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  title: {
    color: "#9D9D9D",
    fontSize: 18,
    paddingTop: 4,
    paddingLeft: 8,
    fontWeight: "bold",
  },
  coin: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    paddingTop: 4,
    paddingBottom: 4,
  },
  input: {
    width: "100%",
    padding: 8,
    height: 40,
    fontSize: 20,
    marginTop: 8,
    color: "#000",
  },
  button: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#80ED99",
    height: 56,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  valueResults: {
    width: "90%",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    backgroundColor: "rgba(47,47,47,.5)",
    borderRadius: 8,
    borderBottomWidth: 5,
    borderBottomColor: "rgba(128,237,153,.4)",
    elevation: 2,
  },
  value: {
    color: "#f9f9f9",
    fontSize: 28,
    fontWeight: "bold",
  },
  nullValue: {
    textAlign: "center",
    color: "#5e5e5e",
    fontSize: 18,
  },
  valueText: {
    color: "#5e5e5e",
    fontSize: 22,
    margin: 8,
  },
});
