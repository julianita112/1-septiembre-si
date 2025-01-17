import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Dialog,
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { EyeIcon, CogIcon } from "@heroicons/react/24/solid";
import axios from "../../utils/axiosConfig";
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export function OrdenesProducidas() {
  const [ordenesProducidas, setOrdenesProducidas] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState({});

  useEffect(() => {
    fetchOrdenesProducidas();
  }, []);

  const fetchOrdenesProducidas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/ordenesproduccion/producidas");
      setOrdenesProducidas(response.data);
    } catch (error) {
      console.error("Error fetching órdenes producidas:", error);
    }
  };

  const handleViewDetails = (orden) => {
    setSelectedOrden(orden);
    setDetailsOpen(true);
  };

  const handleDetailsOpen = () => setDetailsOpen(!detailsOpen);

  return (
    <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
      <CardBody className="p-4">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Lista de Órdenes Producidas
        </Typography>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Orden
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Orden
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordenesProducidas.map((orden) => (
                <tr key={orden.id_orden}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {orden.numero_orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orden.fecha_orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orden.estado || "Sin estado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orden.ordenProduccionDetalles.slice(0, 3).map(detalle => (
                      <div key={detalle.id_detalle_orden}>
                        <Typography className="text-sm">
                          {detalle.productoDetalleOrdenProduccion.nombre}: {detalle.cantidad}
                        </Typography>
                      </div>
                    ))}
                    {orden.ordenProduccionDetalles.length > 3 && (
                      <Typography className="text-sm text-gray-400">
                        y {orden.ordenProduccionDetalles.length - 3} más...
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <IconButton
                        className="btnvisualizar"
                        size="sm"
                        onClick={() => handleViewDetails(orden)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        className="btnproducir"
                        size="sm"
                        color="green"
                      >
                        <CogIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>

      <Dialog open={detailsOpen} handler={handleDetailsOpen} className="max-w-xs w-11/12 bg-white rounded-lg shadow-lg" size="xs">
        <DialogHeader className="text-xl font-bold text-gray-800">
          Detalles de la Orden de Producción
        </DialogHeader>
        <DialogBody className="space-y-2">
          <div className="space-y-1">
            <Typography variant="subtitle2" className="font-bold text-gray-800">ID Orden:</Typography>
            <Typography className="text-sm">{selectedOrden.id_orden}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Número de Orden:</Typography>
            <Typography className="text-sm">{selectedOrden.numero_orden}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Fecha de Orden:</Typography>
            <Typography className="text-sm">{selectedOrden.fecha_orden}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Producción Completada:</Typography>
            <Typography className="text-sm">{selectedOrden.produccion_completada ? "Sí" : "No"}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Estado:</Typography>
            <Typography className="text-sm">{selectedOrden.estado || "Sin estado"}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Productos:</Typography>
            {selectedOrden.ordenProduccionDetalles?.map(detalle => (
              <Typography key={detalle.id_detalle_orden} className="text-sm">
                {detalle.productoDetalleOrdenProduccion.nombre}: {detalle.cantidad}
              </Typography>
            ))}
            <Typography variant="subtitle2" className="font-bold text-gray-800">Creado:</Typography>
            <Typography className="text-sm">{selectedOrden.createdAt ? new Date(selectedOrden.createdAt).toLocaleString() : 'N/A'}</Typography>
            <Typography variant="subtitle2" className="font-bold text-gray-800">Actualizado:</Typography>
            <Typography className="text-sm">{selectedOrden.updatedAt ? new Date(selectedOrden.updatedAt).toLocaleString() : 'N/A'}</Typography>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-center">
          <Button className="btncancelarm" size="sm" onClick={handleDetailsOpen}>
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}

export default OrdenesProducidas;
