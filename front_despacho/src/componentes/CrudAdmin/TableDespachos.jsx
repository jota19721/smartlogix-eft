import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";
import Swal from "sweetalert2";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargarDespachos = async () => {
    try {
      setCargando(true);

      const response = await axios.get("/api/v1/despachos", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Despachos obtenidos:", response.data);
      setDespachos(response.data);
    } catch (error) {
      console.error("Error al cargar despachos:", error);

      Swal.fire({
        title: "Error al cargar despachos",
        text:
          error.response?.data?.message ||
          error.response?.data ||
          "No se pudieron obtener los despachos desde el backend.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDespachos();
  }, []);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  const handleCerrarModal = () => {
    setOpenModal(false);
    setDespachoSeleccionado(null);
  };

  const handleDespachoCerrado = async () => {
    setOpenModal(false);
    setDespachoSeleccionado(null);
    await cargarDespachos();
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <h2 className="text-2xl font-bold text-teal-600 my-4">
              Lista de despachos
            </h2>

            {cargando ? (
              <p className="text-lg font-semibold py-8">
                Cargando despachos...
              </p>
            ) : despachos.length === 0 ? (
              <p className="text-lg font-semibold py-8">
                No hay despachos registrados.
              </p>
            ) : (
              <table className="table-fixed">
                <thead>
                  <tr className="py-10">
                    <th className="pr-10">Orden de despacho</th>
                    <th className="pr-10">Orden de compra</th>
                    <th className="pr-10">Dirección de entrega</th>
                    <th className="pr-10">Fecha despacho</th>
                    <th className="pr-10">Patente camión</th>
                    <th className="pr-10">Entregado</th>
                    <th className="pr-10">Intentos de entrega</th>
                    <th className="pr-10">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {despachos.map((despacho) => (
                    <tr key={despacho.idDespacho}>
                      <td className="pr-10 py-10 items-center">
                        {despacho.idDespacho}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {despacho.idCompra}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {despacho.direccionCompra}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {despacho.fechaDespacho}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {despacho.patenteCamion}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {despacho.entregado
                          ? "Despacho entregado"
                          : "Despacho pendiente"}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        {despacho.intento}
                      </td>

                      <td className="pr-10 py-10 items-center">
                        <button
                          onClick={() => handleAbrirModal(despacho)}
                          className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                        >
                          Cerrar despacho
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
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={handleDespachoCerrado}
          />
        )}
      </Modal>
    </>
  );
};