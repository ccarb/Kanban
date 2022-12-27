import './App.css';

function App() {
  return (
    <div className="d-flex justify-content-center">
    <div className="d-none d-sm-block card mt-3" style={{width: "460px"}}>
      <div className="card-header">
        <p className="card-title h3">Checklists</p>
      </div>
      <div className="card-body">
        <ul className="list-group">
          <li className="list-group-item"> Example list</li>
        </ul>
      </div>
    </div>
      <div className="d-block d-sm-none card mt-3" style={{width: "80%"}}>
        <div className="card-header">
          <p className="card-title h3">Checklists</p>
        </div>
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item"> Example list</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
