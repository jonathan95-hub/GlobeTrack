import React from 'react';
// Componentes principales de la HomePage
import MapGlobal from '../../components/HomePage/Map'; // Mapa global interactivo
import ListBestPost from '../../components/HomePage/ListBestPost'; // Lista de los mejores posts
import RadialTopVisitedDesiredComponent from '../../components/HomePage/RadialTopVisitedAndDesiredComponent'; // Gráfico radial de destinos top
import ToptravelersComponent from '../../components/HomePage/ToptravelersComponent'; // Ranking de top viajeros
import TopGroups from '../../components/HomePage/TopGroups'; // Ranking de top grupos

const HomePage = () => {
  return (
    <div className="container-fluid bg-light py-4 min-vh-100">
      {/* Contenedor principal con altura mínima de pantalla y fondo claro */}
      <div className="row g-4 h-100">

        {/* ----------------- Columna izquierda ----------------- */}
        <div className="col-12 col-lg-7 d-flex flex-column gap-4 h-100">

          {/* Mapa Global */}
          <div className="card shadow-lg border-0 flex-grow-1">
            <div className="card-body p-3 d-flex flex-column">
              <h4 className="text-primary fw-bold mb-3 text-center">Mapa Global</h4>
              <div className="flex-grow-1">
                <MapGlobal /> {/* Componente del mapa interactivo */}
              </div>
            </div>
          </div>

          {/* Gráfico Radial de destinos más visitados y deseados */}
          <div className="card shadow border-0">
            <div className="card-body p-3">
              <RadialTopVisitedDesiredComponent />
            </div>
          </div>

          {/* Sección de Top Groups y Top Travelers */}
          <div className="row g-4 flex-grow-1">

            {/* Top Groups */}
            <div className="col-12 col-md-6 d-flex flex-column">
              <div className="card shadow border-0 h-100">
                <div className="card-body p-3 d-flex flex-column">
                  <TopGroups /> {/* Ranking de grupos más activos/populares */}
                </div>
              </div>
            </div>

            {/* Top Travelers */}
            <div className="col-12 col-md-6 d-flex flex-column">
              <div className="card shadow border-0 flex-grow-1">
                <div className="card-body p-3 d-flex flex-column">
                  <ToptravelersComponent /> {/* Ranking de viajeros top */}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------- Columna derecha ----------------- */}
        {/* Lista de los mejores posts */}
        <div className="col-12 col-lg-5 d-flex flex-column h-100 vh-100">
          <div className="card shadow-lg border-0 flex-grow-1">
            <div className="card-body p-3 d-flex flex-column">
              <div className="flex-grow-1">
                <ListBestPost /> {/* Componente que muestra los posts más destacados */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
