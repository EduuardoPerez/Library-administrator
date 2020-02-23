import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

// Redux actions
import { buscarUsuario } from '../../actions/buscarUsuarioActions';

class PrestamoLibro extends Component {
  state={
    busqueda: '',
    noResultados: false
  }

  // Search subscriber for code
  buscarAlumno = e => {
    e.preventDefault();

    // Get the value to search
    const { busqueda } = this.state

    // Extract firestore & buscarUsuario
    const { firestore, buscarUsuario } = this.props;

    // Make the query
    const coleccion = firestore.collection('suscriptores');
    const consulta = coleccion.where("codigo", "==", busqueda).get();

    // Read the results
    consulta.then(resultado => {
      if (resultado.empty) {
        // No results
        // Store in Redux an empty object
        buscarUsuario({})
        // Update the local state if there're results
        this.setState({
          noResultados:true
        })
      } else {
        // There are results
        // Store result in Redux's state
        const datos = resultado.docs[0];
        buscarUsuario(datos.data());
        // Update the local state if there're results
        this.setState({
          noResultados: false
        })
      }
    })
  }

  // Store student data to request the book
  solitarPrestamo = () => {
    const { usuario } = this.props;

    // Application date
    usuario.fecha_solicitud = new Date().toLocaleDateString();

    // You cannot mute the props, take a copy and create a new array
    let prestados = [];
    prestados = [...this.props.libro.prestados, usuario];

    // Copy the object and add the borrowed
    const libro = {...this.props.libro};

    // Delete previous borrowed
    delete libro.prestados;

    // Assign the borrowed
    libro.prestados = prestados;

    // Get firestore & history from props
    const { firestore, history } = this.props;

    // Save in DB
    firestore.update({
      collection: 'libros',
      doc: libro.id
    }, libro).then(history.push('/'));
  }

  // Save code in the state
  leerDato = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  

  render() {
    // Extract book from props
    const { libro } = this.props;

    // Show spinner
    if(!libro) return <Spinner />

    // Extract the subscriber's information for display it
    const { usuario } = this.props;

    let fichaAlumno, btnSolicitar;

    if (usuario.nombre) {
      fichaAlumno = <FichaSuscriptor
                      alumno={usuario}
                    />
      btnSolicitar = <button 
                       type="button"
                       className="btn btn-primary btn-block"
                       onClick={this.solitarPrestamo}
                     >Solicitar prestamo</button>
    } else {
      fichaAlumno = null;
      btnSolicitar = null;
    }
    
    // Show error message
    const { noResultados } = this.state;
    let mensajeResultado = '';
    
    if(noResultados) {
      mensajeResultado = <div className="alert alert-danger text-center font-weight-bold">
                            No hay resultados para el código buscado
                         </div>
    } else {
      mensajeResultado = null;
    }

    return (
      <div className="row">
        <div className="col-12 mb-4">
          <Link to={'/'} className="btn btn-secondary">
            <i className="fas fa-arrow-circle-left"></i> {''}
            Volver al listado
          </Link>
        </div>
        <div className="col-12">
          <h2>
            <i className="fas fa-book"></i> {''}
            Solicitar prestamo: {libro.titulo}
          </h2>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form
                onSubmit={this.buscarAlumno}
                className="mb-4"
              >
                <legend className="color-primary text-center">
                  Buscar suscriptor por código
                </legend>
                <div className="form-group">
                  <input
                    type="text"
                    name="busqueda"
                    className="form-control"
                    onChange={this.leerDato}
                  />
                </div>
                <input type="submit" className="btn btn-success btn-block" value="Buscar alumno"/>
              </form>

              {/* Show the student file and the button to request the loan */}
              {fichaAlumno}
              {btnSolicitar}

              {/* Show a no results message */}
              {mensajeResultado}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PrestamoLibro.propTypes = {
  firestore: PropTypes.object.isRequired
}

export default compose(
  firestoreConnect( props => [
    {
      collection: 'libros',
      storeAs: 'libro',
      doc: props.match.params.id
    }
  ]),
  connect(( { firestore: { ordered }, usuario }, props ) => ({
    libro: ordered.libro && ordered.libro[0],
    usuario: usuario
  }), { buscarUsuario })
)(PrestamoLibro);
