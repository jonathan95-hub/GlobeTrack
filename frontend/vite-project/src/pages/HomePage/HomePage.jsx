import React from 'react';
import MapGlobal from '../../components/HomePage/Map';
import ListBestPost from '../../components/HomePage/ListBestPost';
import RadialTopVisitedDesiredComponent from '../../components/HomePage/RadialTopVisitedAndDesiredComponent';
import ToptravelersComponent from '../../components/HomePage/ToptravelersComponent';
import TopGroups from '../../components/HomePage/TopGroups';

const HomePage = () => {
return ( <div className="container-fluid bg-light py-4 min-vh-100"> <div className="row g-4 h-100">

    {/* Columna izquierda */}
    <div className="col-12 col-lg-7 d-flex flex-column gap-4 h-100">
      
      {/* Mapa */}
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body p-3 d-flex flex-column">
          <h4 className="text-primary fw-bold mb-3 text-center">Mapa Global</h4>
          <div className="flex-grow-1">
            <MapGlobal />
          </div>
        </div>
      </div>

      {/* Radial */}
      <div className="card shadow border-0">
        <div className="card-body p-3">
          <h4 className="text-info fw-bold mb-3 text-center">Top Lugares Visitados</h4>
          <RadialTopVisitedDesiredComponent />
        </div>
      </div>

      {/* Top Groups y Top Travelers */}
      <div className="row g-4 flex-grow-1">
        <div className="col-12 col-md-6 d-flex flex-column">
          <div className="card shadow border-0 flex-grow-1">
            <div className="card-body p-3 d-flex flex-column">
              <h4 className="text-danger fw-bold mb-3 text-center">Grupos Destacados</h4>
              <TopGroups />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column">
          <div className="card shadow border-0 flex-grow-1">
            <div className="card-body p-3 d-flex flex-column">
              <h4 className="text-warning fw-bold mb-3 text-center">Top Viajeros</h4>
              <ToptravelersComponent />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Columna derecha: ListBestPost */}
    <div className="col-12 col-lg-5 d-flex flex-column h-100">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body p-3 d-flex flex-column">
          <div className="flex-grow-1">
            <ListBestPost />
          </div>
        </div>
      </div>
    </div>

  </div>
</div>


);
};

export default HomePage;
