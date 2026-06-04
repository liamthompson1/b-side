import { type Product } from "@/lib/products";

export default function ProductCard({
  product,
  featured = false,
  onClick,
}: {
  product: Product;
  featured?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#141414",
        border: "1px solid #252525",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.15s",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (!onClick) return;
        e.currentTarget.style.borderColor = "#e8d44d";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#252525";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", paddingBottom: "60%", background: "#1a1a1a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {product.isNew && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#e8d44d",
              color: "#0a0a0a",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 8px",
              borderRadius: "4px",
            }}
          >
            NEW
          </span>
        )}
        {onClick && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid #3a3a3a",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "10px",
              color: "#aaa",
              letterSpacing: "0.06em",
            }}
          >
            View →
          </div>
        )}
      </div>

      <div style={{ padding: featured ? "16px" : "12px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#e8d44d",
            marginBottom: "4px",
            textTransform: "uppercase",
          }}
        >
          {product.brand}
        </p>
        <p
          style={{
            fontSize: featured ? "14px" : "13px",
            fontWeight: 600,
            color: "#ffffff",
            marginBottom: "6px",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: "10px", color: i < product.stars ? "#e8d44d" : "#333" }}>
              ★
            </span>
          ))}
        </div>
        <p style={{ fontSize: featured ? "16px" : "14px", fontWeight: 700, color: "#ffffff" }}>
          £{product.price.toLocaleString()}
        </p>
        {featured && (
          <p style={{ fontSize: "11px", color: "#6b6b6b", marginTop: "8px", lineHeight: 1.5 }}>
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}
