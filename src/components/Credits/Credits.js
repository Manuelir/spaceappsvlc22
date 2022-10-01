const Credits = () => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        marginRight: 15,
        marginBottom: 15,
        padding: '1em',
        width: 350,
        color: '#fff',
        fontSize: 12,
        lineHeight: 1.2,
      }}
    >
      <p>
        Seguimiento de la ISS para Space App (
        <a
          href="https://github.com/Manuelir/spaceappsvlc22"
          target="_blank"
          rel="noreferrer"
        >
          Source code
        </a>
        )
      </p>
    </div>
  );
};

export default Credits;
