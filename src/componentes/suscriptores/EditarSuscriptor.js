import React, { Component } from 'react'
// Compose es una utilidad (de programación funcional)
// que permite aplicar múltiples potenciadores de store en serie
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

class EditarSuscriptor extends Component {

  // Create refs instead of storing in the state
  nombreInput = React.createRef();
  apellidoInput = React.createRef();
  codigoInput = React.createRef();
  carreraInput = React.createRef();

  // Edit the subscriber in the DB
  editarSuscriptor = e => {
    e.preventDefault();

    // Create the object to update
    const suscriptorActualizado = {
      nombre: this.nombreInput.current.value,
      apellido: this.apellidoInput.current.value,
      codigo: this.codigoInput.current.value,
      carrera: this.carreraInput.current.value
    }

    // Extract firestore and history from props
    const { suscriptor, firestore, history } = this.props;

    // Save in the DB with firestore
    firestore.update({
      collection: 'suscriptores',
      doc: suscriptor.id
    }, suscriptorActualizado).then(history.push('/suscriptores'));
  }

  render() {
    const { suscriptor } = this.props;
    
    if(!suscriptor) return <Spinner />

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
            <i className="fas fa-user"></i> {''}
            Editar suscriptor
          </h2>
          <div className="row justify-content-center">
            <div className="col-md-8 mt-5">
              <form
                onSubmit={this.editarSuscriptor}
              >

                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Nombre del suscriptor"
                    required
                    ref={this.nombreInput}
                    defaultValue={suscriptor.nombre}
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
                    ref={this.apellidoInput}
                    defaultValue={suscriptor.apellido}
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
                    ref={this.carreraInput}
                    defaultValue={suscriptor.carrera}
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
                    ref={this.codigoInput}
                    defaultValue={suscriptor.codigo}
                  />
                </div>

                <input
                  type="submit"
                  value="Guardar cambios"
                  className="btn btn-success"
                />

              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditarSuscriptor.propTypes = {
  firestore: PropTypes.object.isRequired
}

export default compose(
  firestoreConnect( props => [
    {
      collection: 'suscriptores',
      storeAs: 'suscriptor',
      doc: props.match.params.id
    }
  ]),
  connect(( {firestore: { ordered }}, props ) => ({
    suscriptor: ordered.suscriptor && ordered.suscriptor[0]
  }))
)(EditarSuscriptor);
