import "../LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loader-wrapper">
        <div className="orbit orbit-1"></div>
        <div className="orbit orbit-2"></div>
        <div className="orbit orbit-3"></div>

        <div className="center-circle">
          <span>Loading</span>
        </div>
      </div>

      <div className="loading-text">Preparing your dashboard...</div>
    </div>
  );
}
