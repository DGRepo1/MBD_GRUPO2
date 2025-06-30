/*
crear usuario admin y dar privilegios
CREATE USER admin IDENTIFIED BY admin;
GRANT CONNECT, RESOURCE TO ampara_user;
ALTER USER admin DEFAULT TABLESPACE USERS;
ALTER USER admin QUOTA UNLIMITED ON USERS;
*/

-- Usuarios (admin y abogados)
CREATE TABLE Usuario (
    idUsuario NUMBER PRIMARY KEY,
    Correo VARCHAR2(50) UNIQUE NOT NULL,
    Nombre VARCHAR2(50) NOT NULL,
    Contrasena VARCHAR2(255) NOT NULL,
    Rol VARCHAR2(20) CHECK (Rol IN ('ADMIN', 'ABOGADO')) NOT NULL
);

-- Abogados
CREATE TABLE Abogado (
    idAbogado NUMBER PRIMARY KEY,
    idUsuario NUMBER NOT NULL,
    Especialidad VARCHAR2(50),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- Clientes
CREATE TABLE Cliente (
    IdCliente NUMBER PRIMARY KEY,
    NombreCliente VARCHAR2(50) NOT NULL,
    CorreoCliente VARCHAR2(50)
);

-- Documentos
CREATE TABLE Documento (
    idDocumento NUMBER PRIMARY KEY,
    NombreDocumento VARCHAR2(50),
    TipoDocumento VARCHAR2(30),
    FechaDocumento DATE
);

-- Casos legales
CREATE TABLE CasoLegal (
    idCaso NUMBER PRIMARY KEY,
    FechaRegistro DATE,
    NombreCaso VARCHAR2(50),
    DescripcionCaso CLOB,
    IdDocumento NUMBER,
    IdCliente NUMBER,
    FOREIGN KEY (IdDocumento) REFERENCES Documento(idDocumento),
    FOREIGN KEY (IdCliente) REFERENCES Cliente(IdCliente)
);

-- Asignación de casos
CREATE TABLE AsignacionCaso (
    IdAsignacionCaso NUMBER PRIMARY KEY,
    FechaAsignacion DATE DEFAULT SYSDATE,
    IdCasoLegal NUMBER,
    IdAbogado NUMBER,
    FOREIGN KEY (IdCasoLegal) REFERENCES CasoLegal(idCaso),
    FOREIGN KEY (IdAbogado) REFERENCES Abogado(idAbogado)
);

-- Seguimiento de estado de un caso
CREATE TABLE SeguimientoCaso (
    idSeguimientoCaso NUMBER PRIMARY KEY,
    Estado CHAR(1) CHECK (Estado IN ('1','0')),
    FechaInicio DATE,
    FechaCierre DATE,
    IdCaso NUMBER,
    FOREIGN KEY (IdCaso) REFERENCES CasoLegal(idCaso)
);

-- Comentarios del abogado
CREATE TABLE Comentario (
    idComentario NUMBER PRIMARY KEY,
    idCaso NUMBER,
    idUsuario NUMBER,
    Texto CLOB,
    FechaComentario DATE DEFAULT SYSDATE,
    FOREIGN KEY (idCaso) REFERENCES CasoLegal(idCaso),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

--||Inserts de prueba||--

--Inserts Usuario--
INSERT INTO Usuario (idUsuario, Correo, Nombre, Contrasena, Rol)
VALUES (1, 'admin@ampara.pe', 'Admin Principal', 'admin123', 'ADMIN'); ---Admin-

INSERT INTO Usuario (idUsuario, Correo, Nombre, Contrasena, Rol)
VALUES (2, 'jsuarez@ampara.pe', 'Julio Suárez', 'julio123', 'ABOGADO');

INSERT INTO Usuario (idUsuario, Correo, Nombre, Contrasena, Rol)
VALUES (3, 'mmarquez@ampara.pe', 'María Márquez', 'maria123', 'ABOGADO');

--Inserts Abogado--
INSERT INTO Abogado (idAbogado, idUsuario, Especialidad)
VALUES (1, 2, 'Regulación Telecomunicaciones');

INSERT INTO Abogado (idAbogado, idUsuario, Especialidad)
VALUES (2, 3, 'Contrataciones con el Estado');

--Insert Cliente--
INSERT INTO Cliente (IdCliente, NombreCliente, CorreoCliente)
VALUES (1, 'RedTel S.A.C.', 'contacto@redtel.com');

INSERT INTO Cliente (IdCliente, NombreCliente, CorreoCliente)
VALUES (2, 'ComNet Perú EIRL', 'soporte@comnet.pe');

--Insert Documento--
INSERT INTO Documento (idDocumento, NombreDocumento, TipoDocumento, FechaDocumento)
VALUES (1, 'Contrato Marco RedTel', 'Contrato', TO_DATE('2024-01-15', 'YYYY-MM-DD'));

INSERT INTO Documento (idDocumento, NombreDocumento, TipoDocumento, FechaDocumento)
VALUES (2, 'Resolución OSIPTEL', 'Resolución', TO_DATE('2024-03-10', 'YYYY-MM-DD'));

--Insert CasoLegal--
INSERT INTO CasoLegal (idCaso, FechaRegistro, NombreCaso, DescripcionCaso, IdDocumento, IdCliente)
VALUES (1, TO_DATE('2024-03-01', 'YYYY-MM-DD'), 'Reclamo por sanción OSIPTEL',
'Caso relacionado con una sanción interpuesta por OSIPTEL debido a un incumplimiento en la portabilidad numérica.', 2, 1);

INSERT INTO CasoLegal (idCaso, FechaRegistro, NombreCaso, DescripcionCaso, IdDocumento, IdCliente)
VALUES (2, TO_DATE('2024-04-12', 'YYYY-MM-DD'), 'Revisión de contrato con proveedor',
'Revisión legal del contrato marco firmado con proveedor de fibra óptica.', 1, 2);


--Inserts AsignacionCaso--
INSERT INTO AsignacionCaso (IdAsignacionCaso, FechaAsignacion, IdCasoLegal, IdAbogado)
VALUES (1, TO_DATE('2024-03-02', 'YYYY-MM-DD'), 1, 1);

INSERT INTO AsignacionCaso (IdAsignacionCaso, FechaAsignacion, IdCasoLegal, IdAbogado)
VALUES (2, TO_DATE('2024-04-13', 'YYYY-MM-DD'), 2, 2);

--Inserts SeguimientoCaso--
INSERT INTO SeguimientoCaso (idSeguimientoCaso, Estado, FechaInicio, FechaCierre, IdCaso)
VALUES (1, '1', TO_DATE('2024-03-02', 'YYYY-MM-DD'), NULL, 1);

INSERT INTO SeguimientoCaso (idSeguimientoCaso, Estado, FechaInicio, FechaCierre, IdCaso)
VALUES (2, '0', TO_DATE('2024-04-13', 'YYYY-MM-DD'), TO_DATE('2024-05-10', 'YYYY-MM-DD'), 2);

--Inserts Comentario--
INSERT INTO Comentario (idComentario, idCaso, idUsuario, Texto, FechaComentario)
VALUES (1, 1, 2, 'Se ha solicitado ampliación del expediente sancionador.', TO_DATE('2024-03-04', 'YYYY-MM-DD'));

INSERT INTO Comentario (idComentario, idCaso, idUsuario, Texto, FechaComentario)
VALUES (2, 2, 3, 'Contrato revisado. Se recomienda incluir cláusula de salida anticipada.', TO_DATE('2024-04-15', 'YYYY-MM-DD'));


--||==============================||--
--||        Funciones PL          ||--
--||==============================||--


-- ========================
-- SECUENCIAS NECESARIAS
-- ========================
CREATE SEQUENCE SEQ_COMENTARIO START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ASIGNACIONCASO START WITH 1 INCREMENT BY 1;

-- ========================
-- LOGIN DE USUARIO
-- ========================
CREATE OR REPLACE FUNCTION SP_LOGIN_USER (
    p_correo IN VARCHAR2,
    p_contrasena IN VARCHAR2
) RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT idUsuario, Nombre, Rol
        FROM Usuario
        WHERE Correo = p_correo AND Contrasena = p_contrasena;
    RETURN v_cursor;
END;
/

-- ========================
-- LISTAR CASOS POR ABOGADO
-- ========================
CREATE OR REPLACE FUNCTION SP_CASOS_POR_ABOGADO (
    p_idAbogado IN NUMBER
) RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT c.idCaso, c.NombreCaso, c.FechaRegistro, cl.NombreCliente, d.NombreDocumento
        FROM CasoLegal c
        JOIN Cliente cl ON c.IdCliente = cl.IdCliente
        JOIN Documento d ON c.IdDocumento = d.idDocumento
        JOIN AsignacionCaso a ON c.idCaso = a.IdCasoLegal
        WHERE a.IdAbogado = p_idAbogado;
    RETURN v_cursor;
END;
/

-- ========================
-- LISTAR TODOS LOS CASOS (ADMIN)
-- ========================
CREATE OR REPLACE FUNCTION SP_LISTAR_CASOS
RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT idCaso, NombreCaso, FechaRegistro
        FROM CasoLegal;
    RETURN v_cursor;
END;
/

-- ========================
-- LISTAR ABOGADOS (ADMIN)
-- ========================
CREATE OR REPLACE FUNCTION SP_LISTAR_ABOGADOS
RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT ab.idAbogado, u.Nombre
        FROM Abogado ab
        JOIN Usuario u ON ab.idUsuario = u.idUsuario;
    RETURN v_cursor;
END;
/

-- ========================
-- LISTAR COMENTARIOS DE UN CASO
-- ========================
CREATE OR REPLACE FUNCTION SP_GET_COMENTARIOS (
    p_idCaso IN NUMBER
) RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT c.idComentario, u.Nombre AS autor, c.Texto, TO_CHAR(c.FechaComentario, 'YYYY-MM-DD HH24:MI') AS fecha
        FROM Comentario c
        JOIN Usuario u ON c.idUsuario = u.idUsuario
        WHERE c.idCaso = p_idCaso
        ORDER BY c.FechaComentario DESC;
    RETURN v_cursor;
END;
/

-- ========================
-- AGREGAR COMENTARIO
-- ========================
CREATE OR REPLACE PROCEDURE SP_AGREGAR_COMENTARIO (
    p_idCaso IN NUMBER,
    p_idUsuario IN NUMBER,
    p_texto IN CLOB
) IS
BEGIN
    INSERT INTO Comentario (idComentario, idCaso, idUsuario, Texto, FechaComentario)
    VALUES (SEQ_COMENTARIO.NEXTVAL, p_idCaso, p_idUsuario, p_texto, SYSDATE);
    COMMIT;
END;
/

-- ========================
-- ASIGNAR CASO A ABOGADO
-- ========================
CREATE OR REPLACE PROCEDURE SP_ASIGNAR_CASO (
    p_idCasoLegal IN NUMBER,
    p_idAbogado IN NUMBER
) IS
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists
    FROM AsignacionCaso
    WHERE IdCasoLegal = p_idCasoLegal AND IdAbogado = p_idAbogado;

    IF v_exists = 0 THEN
        INSERT INTO AsignacionCaso (
            IdAsignacionCaso,
            FechaAsignacion,
            IdCasoLegal,
            IdAbogado
        )
        VALUES (
            SEQ_ASIGNACIONCASO.NEXTVAL,
            SYSDATE,
            p_idCasoLegal,
            p_idAbogado
        );
        COMMIT;
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Este caso ya fue asignado a este abogado.');
    END IF;
END;
/

-- ========================
-- LISTAR ASIGNACIONES (ADMIN)
-- ========================
CREATE OR REPLACE FUNCTION SP_LISTAR_ASIGNACIONES
RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT ac.IdAsignacionCaso, ac.FechaAsignacion,
               cl.NombreCliente, c.NombreCaso,
               ab.Especialidad,
               u.Nombre AS NombreAbogado
        FROM AsignacionCaso ac
        JOIN CasoLegal c ON ac.IdCasoLegal = c.idCaso
        JOIN Cliente cl ON c.IdCliente = cl.IdCliente
        JOIN Abogado ab ON ac.IdAbogado = ab.idAbogado
        JOIN Usuario u ON ab.idUsuario = u.idUsuario;
    RETURN v_cursor;
END;
/

-- ========================
-- ELIMINAR ASIGNACIÓN
-- ========================
CREATE OR REPLACE PROCEDURE SP_ELIMINAR_ASIGNACION (
    p_idAsignacionCaso IN NUMBER
) IS
BEGIN
    DELETE FROM AsignacionCaso WHERE IdAsignacionCaso = p_idAsignacionCaso;
    COMMIT;
END;
/


