package com.nikki.backend.entity;

public class User {
    private Integer id;
    private String username;
    private String password;
    private Integer gold;

    // 无参构造（可选）
    public User() {}

    // getter 和 setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getGold() { return gold; }
    public void setGold(Integer gold) { this.gold = gold; }

    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "', gold=" + gold + "}";
    }
}