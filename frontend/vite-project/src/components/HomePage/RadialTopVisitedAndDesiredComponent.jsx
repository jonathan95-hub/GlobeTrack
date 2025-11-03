import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { countryVisitedTopVisited } from '../../core/services/homepage/TopFiveCountryVisited'
import { countryDesiredTopDesired } from '../../core/services/homepage/TopFiveDesiredCountry'

const RadialTopVisitedComponent = () => {
const ColorsVisited = [
  "#ff073a", // rojo neón para el primer sector
  "#ff00ff", // magenta neón
  "#ff4d00", // naranja neón
  "#03fa4d", // verde neón
  "#e804fd"  // fucsia eléctrico
];
const ColorsDesired = [
  "#ff0090", // rosa eléctrico intenso
  "#F4D03F", // amarillo neón
  "#7d00ff", // violeta neón intenso
  "#00ff9d", // verde agua eléctrico
  "#ff6ec7"  // rosa neón brillante
];

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
      } catch (errer) {
        console.error(errer)
      }
    }

    const fecthDataDesired = async () => {
      try {
        const info = await countryDesiredTopDesired()
        if(info.topDesired.length){
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
      <text x={x} y={y} fill="#9FFFFF" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14} fontWeight="bold"  style={{
    textShadow: '0 0 6px rgba(0, 255, 255, 0.8)', // efecto neón sutil
  }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (!dataVisited.length) return <p>Cargando...</p>

  return (
    <div className="d-flex justify-content-start  ">
    <div className='d-flex align-items-center flex-column  imageGrap p-4 mt-3 rounded-4 size' style={{ background: "#0c0c0c"}}>
      <h2 className='titleGrap'>Países más Visitados</h2>
    <div className='my-2 'style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dataVisited}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="100%"
            labelLine={false}
            label={renderCustomizedLabel}
            stroke="#0fffc0"       // color del borde
            strokeWidth={2}
             style={{ filter: 'drop-shadow(0 0 4px #0fffc0)' }}
          >
            {dataVisited.map((entry, idx) => (
              <Cell key={entry.name} fill={ColorsVisited[idx % ColorsVisited.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} visitas`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    </div>
    
    
       <div className='d-flex align-items-center flex-column imageGrap ms-3 mt-3 rounded-4 size ' style={{ background: "#0c0c0c"}}>
      <h2 className='titleGrap'>Países más Deseados</h2>
    <div className='my-2 'style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart className=''>
          <Pie
            data={dataDesired}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="100%"
            labelLine={false}
            label={renderCustomizedLabel}
            stroke="#0fffc0"      
            strokeWidth={2}
             style={{ filter: 'drop-shadow(0 0 4px #0fffc0)', color: "white" }}
          >
            {dataDesired.map((entry, idx) => (
              <Cell key={entry.name} fill={ColorsDesired[idx % ColorsDesired.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} Deseado`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    </div>
    

    </div>
  )
}

export default RadialTopVisitedComponent
