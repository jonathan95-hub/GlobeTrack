import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { countryVisitedTopVisited } from '../../core/services/homepage/TopFiveCountryVisited'
import { countryDesiredTopDesired } from '../../core/services/homepage/TopFiveDesiredCountry'

const RadialTopVisitedComponent = () => {
  const ColorsVisited = [
    "#ff073a", "#ff00ff", "#ff4d00", "#03fa4d", "#e804fd"
  ]
  const ColorsDesired = [
    "#ff0090", "#F4D03F", "#7d00ff", "#00ff9d", "#ff6ec7"
  ]

  const RADIAN = Math.PI / 180
  const [dataVisited, setDataVisited] = useState([])
  const [dataDesired, setDataDesired] = useState([])

  const fetchDataVisited = async () => {
    try {
      const info = await countryVisitedTopVisited()
      if (info?.topVisited?.length) {
        const formatted = info.topVisited.map(country => ({
          name: country.name,
          value: country.userVisited
        }))
        setDataVisited(formatted)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fecthDataDesired = async () => {
    try {
      const info = await countryDesiredTopDesired()
      if (info.topDesired.length) {
        const formatted = info.topDesired.map(country => ({
          name: country.name,
          value: country.wishedByUser
        }))
        setDataDesired(formatted)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDataVisited()
    fecthDataDesired()
  }, [])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text
        x={x}
        y={y}
        fill="#00ffff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
        style={{
          textShadow: '0 0 8px rgba(0, 255, 255, 0.8)',
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (!dataVisited.length) return <p className="text-center mt-4 text-light">Cargando...</p>

  return (
    <div
      className="d-flex flex-wrap justify-content-center align-items-start gap-4 mt-4"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a 30%, #000000 100%)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 0 25px rgba(0,255,255,0.15)',
      }}
    >

      {/* Gráfico: Países más visitados */}
      <div
        className="d-flex flex-column align-items-center p-4 rounded-4 shadow-lg"
        style={{
          background: 'rgba(15, 15, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,255,255,0.3)',
          boxShadow: '0 0 25px rgba(0,255,255,0.15)',
          color: '#fff',
          width: '350px',
          maxWidth: '90%',
        }}
      >
        <h2
          className="fw-bold text-center mb-3"
          style={{
            color: '#00ffff',
            textShadow: '0 0 10px rgba(0,255,255,0.6)',
          }}
        >
          Países más Visitados
        </h2>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={dataVisited}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                labelLine={false}
                label={renderCustomizedLabel}
                stroke="#00ffff"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 6px #00ffff)' }}
              >
                {dataVisited.map((entry, idx) => (
                  <Cell key={entry.name} fill={ColorsVisited[idx % ColorsVisited.length]} />
                ))}
              </Pie>
         <Tooltip
  contentStyle={{
    backgroundColor: '#aaa9a9ff',
    border: '1px solid #00ffff',
    borderRadius: '8px',
    color: '#fff',
  }}
  formatter={(value, name, props) => [
    `${value} visitas`,      // texto principal
    props.payload.name       // nombre del país
  ]}
/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico: Países más deseados */}
      <div
        className="d-flex flex-column align-items-center p-4 rounded-4 shadow-lg"
        style={{
          background: 'rgba(15, 15, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,105,180,0.3)',
          boxShadow: '0 0 25px rgba(255,105,180,0.15)',
          color: '#fff',
          width: '350px',
          maxWidth: '90%',
        }}
      >
        <h2
          className="fw-bold text-center mb-3"
          style={{
            color: '#ff6ec7',
            textShadow: '0 0 10px rgba(255,105,180,0.6)',
          }}
        >
          Países más Deseados
        </h2>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={dataDesired}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                labelLine={false}
                label={renderCustomizedLabel}
                stroke="#ff6ec7"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 6px #ff6ec7)' }}
              >
                {dataDesired.map((entry, idx) => (
                  <Cell key={entry.name} fill={ColorsDesired[idx % ColorsDesired.length]} />
                ))}
              </Pie>
             <Tooltip
  contentStyle={{
    backgroundColor: '#aaa9a9ff',
    border: '1px solid #ff6ec7',
    borderRadius: '8px',
    color: '#fff',
  }}
  formatter={(value, name, props) => [
    `${value} deseado(s)`,
    props.payload.name
  ]}
/>

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default RadialTopVisitedComponent
