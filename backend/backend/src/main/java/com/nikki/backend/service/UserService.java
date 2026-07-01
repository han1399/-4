package com.nikki.backend.service;

import com.nikki.backend.entity.User;
import com.nikki.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    // 注册
    public boolean register(String username, String password) {
        if (userMapper.findByUsername(username) != null) {
            return false; // 用户名已存在
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // 实际应加密，毕设暂不处理
        user.setGold(1000);
        return userMapper.insert(user) > 0;
    }

    // 登录
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // 增加金币
    public boolean addGold(Integer userId, int amount) {
        User user = userMapper.findByUsername(null); // 需要先根据id查用户，这里先简单写，后面完善
        // 暂时留空，之后实现
        return false;
    }
}