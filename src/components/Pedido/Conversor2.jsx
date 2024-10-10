useEffect(() => {
    const fetchProductosAPI = async () => {
      console.log(zona);
      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/cliente/${zona}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los productos de la API");
        }
        const data = await response.json();
        console.log("Esto hay en data" + JSON.stringify(data));
        // const prodFilt = data.filter(data => data.estado=== 'S');
        setProductosAPI(data);
      } catch (error) {
        console.error("Error fetching productosAPI:", error);
      }
    };

    fetchProductosAPI();
  }, []);


  useEffect(() => {
    if (id) {
      const fetchPedido = async () => {
        try {
          const response = await fetch(
            `http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Error al obtener el pedido");
          }
          const data = await response.json();
          console.log(JSON.stringify(data));
          setPedidoId(data.id);
          setIsEditing(true);
          setSelectedClienteId(data.idCliente);
          const cliente = await fetch(
            `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${data.idCliente}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const clienteData = await cliente.json();
          console.log("Esto hay en clientes" + clienteData);

          setSelectedCliente(clienteData.razonSocial);

          // Actualizamos los detalles del cliente cuando cargamos el pedido
          setClienteDetails({
            cuit: clienteData.cuit || "",
            condicionIva: clienteData.condicionIva || "",
            condicionVenta: clienteData.condicionVenta || "",
            razonSocial: clienteData.razonSocial || "",
            domicilio: clienteData.domicilio || "",
          });

          const detalles = data.pedidoDetalles.map((detalle) => {
            const producto = detalle.producto;
            return {
              codigo: producto.codigo,
              descripcion: producto.descripcion,
              cantidad: detalle.cantidad,
              precio: producto.precioVenta,
              descuento: detalle.descuento,
              total: detalle.total,
              removable: true,
            };
          });
          console.log("Esto hay en detalles" + detalles);
          setProductos(detalles);
        } catch (error) {
          console.error("Error fetching pedido:", error);
        }
      };

      fetchPedido();
    }
  }, [id]);
