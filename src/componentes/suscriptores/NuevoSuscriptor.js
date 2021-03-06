import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

class NuevoSuscriptor extends Component {
  state = {
    nombre: '',
    apellido: '',
    carrera: '',
    codigo: ''
  }

  // Add a new subscriber to the DB
  agregarSuscriptor = e => {
    e.preventDefault();

    // Extract the values from the state
    const nuevoSuscriptor = this.state;

    // Extract firestore from props
    const { firestore, history } = this.props;

    // Save in the DB
    firestore.add({ collection: 'suscriptores' }, nuevoSuscriptor)
      .then(() => history.push('/suscriptores'))
  }

  // Extract the input values and place them in the state
  leerDato = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 mb-4">
          <Link to={'/suscriptores'} className="btn btn-secondary">
            <i className="fas fa-arrow-circle-left"></i> {''}
            Volver al listado
          </Link>
        </div>
        <div className="col-12">
          <h2>
            <i className="fas fa-user-plus"></i> {''}
            Nuevo suscriptor
          </h2>
          <div className="row justify-content-center">
            <div className="col-md-8 mt-5">
              <form
                onSubmit={this.agregarSuscriptor}
              >

                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Nombre del suscriptor"
                    required
                    onChange={this.leerDato}
                    value={this.state.nombre}
                  />
                </div>

                <div className="form-group">
                  <label>Apellido:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    placeholder="Apellido del suscriptor"
                    required
                    onChange={this.leerDato}
                    value={this.state.apellido}
                  />
                </div>

                <div className="form-group">
                  <label>Carrera:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="carrera"
                    placeholder="Carrera del suscriptor"
                    required
                    onChange={this.leerDato}
                    value={this.state.carrera}
                  />
                </div>

                <div className="form-group">
                  <label>Codigo:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="codigo"
                    placeholder="Codigo del suscriptor"
                    required
                    onChange={this.leerDato}
                    value={this.state.codigo}
                  />
                </div>

                <input
                  type="submit"
                  value="Agregar suscriptor"
                  className="btn btn-success"
                />

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NuevoSuscriptor.propTypes = {
  firestore: PropTypes.object.isRequired
}

export default firestoreConnect()( NuevoSuscriptor );