package com.nikki.backend.entity;

public class Wardrobe {
    private Integer id;
    private Integer userId;
    private Integer clothingId;
    private Integer quantity;  // 拥有数量

    public Wardrobe() {}

    // Getter 和 Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getClothingId() { return clothingId; }
    public void setClothingId(Integer clothingId) { this.clothingId = clothingId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
