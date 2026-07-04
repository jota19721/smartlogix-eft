import { FormVenta } from "./FormVenta";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import axios from "axios";
import Swal from "sweetalert2";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargarCompras = async () => {
    try {
      setCargando(true);

      const response = await axios.get("/api/v1/ventas", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Ventas obtenidas:", response.data);
      setVentas(response.data);
    } catch (error) {
      console.error("Error al cargar ventas:", error);

      Swal.fire({
        title: "Error al cargar ventas",
        text:
          error.response?.data?.message ||
          error.response?.data ||
          "No se pudieron obtener las ventas desde el backend.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  const handleAbrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal(true);
  };

  const handleCerrarModal = () => {
    setOpenModal(false);
    setVentaSeleccionada(null);
  };

  const handleDespachoCreado = async () => {
    setOpenModal(false);
    setVentaSeleccionada(null);
    await cargarCompras();
  };

  const ventasSinDespacho = ventas.filter((venta) => !venta.despachoGenerado);

  return (
    <>
     <FormVenta onVentaCreada={cargarCompras} />
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <h2 className="text-2xl font-bold text-teal-600 my-4">
              Órdenes de compra pendientes
            </h2>

            {cargando ? (
              <p className="text-lg font-semibold py-8">
                Cargando órdenes de compra...
              </p>
            ) : ventasSinDespacho.length === 0 ? (
              <p className="text-lg font-semibold py-8">
                No hay órdenes de compra pendientes para generar despacho.
              </p>
            ) : (
              <table className="table-fixed">
                <thead>
                  <tr className="py-10">
                    <th className="pr-10">Orden de compra</th>
                    <th className="pr-10">Dirección</th>
                    <th className="pr-10">Fecha de compra</th>
                    <th className="pr-10">Valor total</th>
                    <th className="pr-10">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {ventasSinDespacho.map((venta) => (
                    <tr key={venta.idVenta}>
                      <td className="pr-10 py-10 items-center">
                        {venta.idVenta}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {venta.direccionCompra}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {venta.fechaCompra}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        ${venta.valorCompra}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        <button
                          onClick={() => handleAbrirModal(venta)}
                          className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                        >
                          Generar despacho
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <Modal onClose={handleCerrarModal} open={openModal}>
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={handleCerrarModal}
            onDespachoCreado={handleDespachoCreado}
          />
        )}
      </Modal>
    </>
  );
};