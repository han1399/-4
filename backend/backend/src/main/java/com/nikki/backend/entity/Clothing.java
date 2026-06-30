package com.nikki.backend.entity;

public class Clothing {
    private Integer id;
    private String name;
    private String type;     // hair, suit, top, bottom, shoes, makeup
    private String style;    // 云端, 信鸽, 苹果
    private Integer price;
    private String imageUrl;
    private Integer stock;
    private Boolean isSuit;  // true表示连衣裙/套装

    // 构造方法
    public Clothing() {}

    // Getter 和 Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Boolean getIsSuit() { return isSuit; }
    public void setIsSuit(Boolean isSuit) { this.isSuit = isSuit; }
}
