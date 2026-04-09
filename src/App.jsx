import React from "react";
import { useState } from 'react';
import Select from 'react-select';

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import "./App.css";

// 🔥 IMPORT DOS ANOS
import d2021 from "./tce/despesa_2021.json";
import d2022 from "./tce/despesa_2022.json";
import d2023 from "./tce/despesa_2023.json";
import d2024 from "./tce/despesa_2024.json";
import d2025 from "./tce/despesa_2025.json";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

// 🔥 MAPA DE DADOS POR ANO
const dadosPorAno = {
  2021: d2021.despesa,
  2022: d2022.despesa,
  2023: d2023.despesa,
  2024: d2024.despesa,
  2025: d2025.despesa,
};

export const App = () => {

  // 🔥 NOVO: estado do ano
  const [anoSelecionado, setAnoSelecionado] = useState(2024);

  // 🔥 NOVO: dados dinâmicos
  const dados = dadosPorAno[anoSelecionado] || [];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: 11,
      color: 'blue',
      backgroundColor: state.isSelected ? 'lightblue' : 'white',
    }),
  };

  const setores = [...new Set(dados.map((data) => data.dsc_funcao))];

  let options = []
  setores.forEach(function (e) {
    options.push({ label: e.slice(5), value: e })
  })

  const [selectedOption, setSelectedOption] = useState({
    label: 'ADMINISTRAÇÃO',
    value: '04 - ADMINISTRAÇÃO'
  });

  let filtroSetor = selectedOption.value

  const setor = dados.filter(element => element.dsc_funcao === filtroSetor)
  const totalAnoSetor = setor.reduce(
    (acc, item) => acc + (item.vlr_pago || 0),
    0
  );

  const mesesDoAno = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

  const mesesPago = []
  const mesesEmpenho = []
  let newIndex = 0

  function totalMes(item, indice) {
    mesesEmpenho[newIndex] = setor
      .filter(({ num_mesexercicio }) => num_mesexercicio === indice + 1)
      .reduce((acumulador, { vlr_empenhado }) => acumulador + vlr_empenhado, 0)

    mesesPago[newIndex] = setor
      .filter(({ num_mesexercicio }) => num_mesexercicio === indice + 1)
      .reduce((acumulador, { vlr_pago }) => acumulador + vlr_pago, 0)

    newIndex++
  }

  mesesDoAno.forEach(totalMes)

  let ano = setor.length > 0 ? setor[0].num_anoexercicio : anoSelecionado

  return (
    <div className="App">

      {/* 🔥 NOVO: SELETOR DE ANO */}
      <div style={{ marginBottom: "10px" }}>
        <label>Ano: </label>
        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        >
          {Object.keys(dadosPorAno).map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      <div className="dataCard lineChartCardCard">
        <Line
          data={{
            labels: mesesDoAno,
            datasets: [
              {
                label: "Vlr Empenhado",
                data: mesesEmpenho,
              },
              {
                label: "Vlr Pago",
                data: mesesPago,
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                text: ano + " Despesas de Soledade no Setor: " + filtroSetor,
              },
            },
          }}
        />
      </div>

      <div className="dataCard comboCard">

        {/* seletor de setor original */}
        <Select
          defaultValue={{ label: 'ADMINISTRAÇÃO', value: '04 - ADMINISTRAÇÃO' }}
          onChange={setSelectedOption}
          options={options}
          styles={customStyles}
          isSearchable={false}
        />
        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          Total em {anoSelecionado} :{" "}
          {totalAnoSetor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>

        <div className="tab">
          <h5>Fonte TCE:</h5>
          <a href="https://dadosabertos.tce.mg.gov.br/" target="_blank" rel="noreferrer">
            dadosabertos MG
          </a>
        </div>

      </div>

      <div className="dataCard barChartCard">
        <Bar
          data={{
            labels: mesesDoAno,
            datasets: [
              {
                label: "Valor Pago",
                data: mesesPago,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Despesas",
              },
            },
          }}
        />
      </div>

    </div>
  );
};