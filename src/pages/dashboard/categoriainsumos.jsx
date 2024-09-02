import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import Swal from 'sweetalert2';

export function CategoriaInsumos() {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriasPerPage] = useState(6);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categorias_insumo");
      setCategorias(response.data);
      setFilteredCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  useEffect(() => {
    filterCategorias();
  }, [search, categorias]);

  const filterCategorias = () => {
    const filtered = categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCategorias(filtered);
  };

  const handleOpen = () => {
    setOpen(!open);
    setErrors({});
  };

  const handleDetailsOpen = () => {
    setDetailsOpen(!detailsOpen);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setEditMode(true);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategoria({
      nombre: "",
      descripcion: "",
    });
    setEditMode(false);
    setOpen(true);
  };

  const handleDelete = async (categoria) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro de que deseas eliminar la categoría ${categoria.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/categorias_insumo/${categoria.id_categoria}`);
        fetchCategorias();
        
        Swal.fire({
          icon: 'success',
          title: 'Categoría eliminada',
          text: 'La categoría ha sido eliminada exitosamente.',
          confirmButtonText: 'Aceptar',
          background: '#f0f4f8',
          iconColor: '#28a745',
          confirmButtonColor: '#007bff',
          customClass: {
            title: 'text-lg font-semibold',
            icon: 'text-2xl',
            confirmButton: 'px-4 py-2 text-white'
          }
        });
    
      } catch (error) {
        console.error("Error deleting categoria:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'Esta categoría de insumos no se puede eliminar ya que se encuentra asociada a una compra y/o a un insumo.',
          confirmButtonText: 'Aceptar',
          background: '#ffff',
          iconColor: '#A62A64 ',
          confirmButtonColor: '#000000',
          customClass: {
            title: 'text-lg font-semibold',
            icon: 'text-2xl',
            confirmButton: 'px-4 py-2 text-white'
          }
        });
      }
    }
  }
    

  const handleSave = async () => {
    try {
      const regexNombre = /^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/; // Solo letras y espacios
      const regexDescripcion = /^.{2,50}$/; // De 2 a 50 caracteres
      const errors = {};

      if (!selectedCategoria.nombre.trim()) {
        errors.nombre = "Por favor, ingrese el nombre de la categoría de insumos.";
      } else if (selectedCategoria.nombre.length < 4) {
        errors.nombre = "El nombre debe tener al menos 4 caracteres.";
      } else if (selectedCategoria.nombre.length > 15) {
        errors.nombre = "El nombre no puede tener más de 15 caracteres.";
      } else if (!regexNombre.test(selectedCategoria.nombre)) {
        errors.nombre = "El nombre solo puede contener letras y espacios.";
      }

      if (!selectedCategoria.descripcion.trim()) {
        errors.descripcion = "Por favor, ingrese la descripción de la categoría.";
      } else if (!regexDescripcion.test(selectedCategoria.descripcion)) {
        errors.descripcion = "La descripción debe tener entre 2 y 50 caracteres.";
      }
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }
      
      if (editMode) {
        await axios.put(`http://localhost:3000/api/categorias_insumo/${selectedCategoria.id_categoria}`, selectedCategoria);
        setOpen(false);
        fetchCategorias();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Categoría editada exitosamente"
        });
      } else {
        await axios.post("http://localhost:3000/api/categorias_insumo", selectedCategoria);
        fetchCategorias();
        setOpen(false);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Categoría creada exitosamente"
        });
      }
    } catch (error) {
      console.error("Error saving categoria:", error);
      Swal.fire('Error', 'Hubo un problema al guardar la categoría.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategoria({ ...selectedCategoria, [name]: value });
  
    // Validaciones en tiempo real
    const newErrors = { ...errors };
    const regexNombre = /^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$/; // Solo letras y espacios
    const regexDescripcion = /^.{5,70}$/; // Entre 5 y 70 caracteres
  
    if (name === "nombre") {
      if (!value.trim()) {
        newErrors.nombre = "Por favor, ingrese el nombre de la categoría de insumos.";
      } else if (value.length < 4) {
        newErrors.nombre = "El nombre debe tener al menos 4 caracteres.";
      } else if (value.length > 15) {
        newErrors.nombre = "El nombre no puede tener más de 15 caracteres.";
      } else if (!regexNombre.test(value)) {
        newErrors.nombre = "El nombre solo puede contener letras y espacios.";
      } else if (categorias.some(categoria =>
        categoria.nombre.toLowerCase() === value.toLowerCase() &&
        (!editMode || categoria.id_categoria !== selectedCategoria.id_categoria) // No comparar la categoría actual en modo edición
      )) {
        newErrors.nombre = "El nombre de la categoría ya existe.";
      } else {
        delete newErrors.nombre;
      }
    }
  
    if (name === "descripcion") {
      if (!value.trim()) {
        newErrors.descripcion = "Por favor, ingrese la descripción de la categoría.";
      } else if (value.length < 5) {
        newErrors.descripcion = "La descripción debe tener al menos 5 caracteres.";
      } else if (value.length > 70) {
        newErrors.descripcion = "La descripción no puede tener más de 70 caracteres.";
      } else if (!regexDescripcion.test(value)) {
        newErrors.descripcion = "La descripción debe tener entre 5 y 70 caracteres.";
      } else {
        delete newErrors.descripcion;
      }
    }
  
    setErrors(newErrors);
  };
  
  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleViewDetails = (categoria) => {
    setSelectedCategoria(categoria);
    setDetailsOpen(true);
  };

  

  const handleToggleEstado = async (categoria) => {
    const result = await Swal.fire({
      title: `¿Estás seguro?`,
      text: `¿Deseas ${categoria.activo ? 'desactivar' : 'activar'} la categoría ${categoria.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#A62A64',
      cancelButtonColor: '#000000',
      confirmButtonText: `Sí, ${categoria.activo ? 'desactivar' : 'activar'}`,
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        if (categoria.activo) { // Solo verificamos si intentamos desactivar la categoría
          // Verificar si existen insumos asociados a la categoría que se intenta desactivar
          const response = await axios.get(`http://localhost:3000/api/insumos?categoria_id=${categoria.id_categoria}`);
          const insumosAsociados = response.data;
  
          if (insumosAsociados.length > 0) {
            Swal.fire({
              icon: 'warning',
              title: 'No se puede desactivar la categoría',
              text: `Esta categoría está asociada a ${insumosAsociados.length} insumo(s).`,
              confirmButtonColor: '#A62A64',
              background: '#fff',
              confirmButtonText: 'Aceptar'
            });
            return;
          }
        }
  
        // Si no hay insumos asociados, o si se está activando la categoría, proceder con el cambio de estado
        await axios.patch(`http://localhost:3000/api/categorias_insumo/${categoria.id_categoria}/estado`, { activo: !categoria.activo });
        fetchCategorias();
        Swal.fire({
          icon: 'success',
          title: `La categoría ha sido ${!categoria.activo ? 'activada' : 'desactivada'} correctamente.`,
          confirmButtonColor: '#A62A64',
          background: '#fff',
          confirmButtonText: 'Aceptar'
        });
      } catch (error) {
        console.error("Error al cambiar el estado de la categoría:", error);
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema al cambiar el estado de la categoría.',
          confirmButtonColor: '#A62A64',
          background: '#fff',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };
  

  const indexOfLastCategoria = currentPage * categoriasPerPage;
  const indexOfFirstCategoria = indexOfLastCategoria - categoriasPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstCategoria, indexOfLastCategoria);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCategorias.length / categoriasPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="relative mt-2 h-32 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>


      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
  <CardBody className="p-4">
  <div className="flex items-center justify-between mb-6">
  <Button 
    onClick={handleCreate} 
    className="btnagregar w-40" // Ajusta el ancho horizontal del botón
    size="sm" 
    startIcon={<PlusIcon className="h-4 w-4" />}
  >
    Crear Categoría de Insumos
  </Button>
  <input
  type="text"
  placeholder="Buscar por nombre de Categoría..."
  value={search}
  onChange={handleSearchChange}
  className="ml-[28rem] border border-gray-300 rounded-md focus:border-blue-500 appearance-none shadow-none py-2 px-4 text-sm" // Ajusta el padding vertical y horizontal
  style={{ width: '265px' }} // Ajusta el ancho del campo de búsqueda
/>
</div>


          
          <div className="mb-1">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Lista de Categorías de Insumo
            </Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCategorias.map((categoria) => (
                    <tr key={categoria.id_categoria}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{categoria.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoria.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    <label className="inline-flex relative items-center cursor-pointer">
        <input
            type="checkbox"
            className="sr-only peer"
            checked={categoria.activo}
            onChange={() => handleToggleEstado(categoria)}
        />
        <div
            className={`relative inline-flex items-center cursor-pointer transition-transform duration-300 ease-in-out h-6 w-12 rounded-full focus:outline-none ${
                categoria.activo
                    ? 'bg-gradient-to-r from-green-800 to-green-600 hover:from-green-600 hover:to-green-400 shadow-lg transform scale-105'
                    : 'bg-gradient-to-r from-red-800 to-red-500 hover:from-red-600 hover:to-red-400 shadow-lg transform scale-105'
            }`}
        >
            <span
                className={`transition-transform duration-300 ease-in-out ${
                    categoria.activo ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-5 h-5 transform bg-white rounded-full shadow-md`}
            />
        </div>
        <span
            className={`absolute left-1 flex items-center text-xs text-white font-semibold ${
                categoria.activo ? 'opacity-0' : 'opacity-100'
            }`}
        >
            
        </span>
        <span
            className={`absolute right-1 flex items-center text-xs text-white font-semibold ${
                categoria.activo ? 'opacity-100' : 'opacity-0'
            }`}
        >
            
        </span>
    </label>
</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <IconButton
                            className="btnedit"
                            size="sm"
                            onClick={() => handleEdit(categoria)}
                            disabled={!categoria.activo}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            className="btncancelarinsumo"
                            size="sm"
                            onClick={() => handleDelete(categoria)}
                            disabled={!categoria.activo}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            className="btnvisualizar"
                            size="sm"
                            onClick={() => handleViewDetails(categoria)}
                            disabled={!categoria.activo}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <ul className="flex justify-center items-center space-x-2">
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination ${number === currentPage ? "active" : ""}`}
                    size="sm"
                  >
                    {number}
                  </Button>
                ))}
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <Dialog open={open} handler={handleOpen} className="max-w-md w-10/12 p-5 bg-white rounded-2xl shadow-lg" size="xs">
        <DialogHeader className="text-xl font-bold text-gray-800">
          {editMode ? "Editar Categoría de Insumos" : "Crear Categoría de Insumos"}
        </DialogHeader>
        <DialogBody divider>
          <div className="space-y-3">
            <Input
              label="Nombre de la categoría"
              name="nombre"
              value={selectedCategoria.nombre}
              onChange={handleChange}
              required
              error={errors.nombre}
              className="w-full"
            />
            {errors.nombre && <Typography color="red" className="text-xs">{errors.nombre}</Typography>}
            <Input
              label="Descripción"
              name="descripcion"
              value={selectedCategoria.descripcion}
              onChange={handleChange}
              required
              error={errors.descripcion}
              className="w-full"
            />
            {errors.descripcion && <Typography color="red" className="text-xs">{errors.descripcion}</Typography>}
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="text" className="btncancelarinsumom" size="sm" color="red" onClick={handleOpen}>
            Cancelar
          </Button>
          <Button variant="gradient" className="btnagregar" color="green" size="sm" onClick={handleSave}>
            {editMode ? "Guardar Cambios" : "Crear Categoría"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={detailsOpen} handler={handleDetailsOpen} className="max-w-xs w-11/12" size="xs">
        <DialogHeader className="font-bold text-gray-900">
          Detalles de la Categoría de Insumos
        </DialogHeader>
        <DialogBody>
          <div className="space-y-2">
            <Typography variant="subtitle2" className="font-bold text-gray-800">Nombre:</Typography>
            <Typography className="text-sm">{selectedCategoria.nombre}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Descripción:</Typography>
            <Typography className="text-sm">{selectedCategoria.descripcion}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Creado:</Typography>
            <Typography className="text-sm">{selectedCategoria.createdAt ? new Date(selectedCategoria.createdAt).toLocaleString() : 'N/A'}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Actualizado:</Typography>
            <Typography className="text-sm">{selectedCategoria.updatedAt ? new Date(selectedCategoria.updatedAt).toLocaleString() : 'N/A'}</Typography>
            {selectedCategoria.insumos && (
              <>
                <Typography variant="subtitle2" className="font-bold text-gray-800">Insumos:</Typography>
                {selectedCategoria.insumos.map((insumo) => (
                  <Typography key={insumo.id_insumo} className="text-sm">
                    {insumo.nombre} (Stock: {insumo.stock_actual})
                  </Typography>
                ))}
              </>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="btncancelarm" size="sm" onClick={handleDetailsOpen}>
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}