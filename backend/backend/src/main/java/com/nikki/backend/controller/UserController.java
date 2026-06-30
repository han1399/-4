package com.nikki.backend.controller;

import com.nikki.backend.entity.User;
import com.nikki.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestParam String username, @RequestParam String password) {
        boolean success = userService.register(username, password);
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        if (!success) {
            result.put("message", "用户名已存在");
        }
        return result;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String username, @RequestParam String password) {
        User user = userService.login(username, password);
        Map<String, Object> result = new HashMap<>();
        if (user != null) {
            result.put("success", true);
            result.put("userId", user.getId());
            result.put("gold", user.getGold());
        } else {
            result.put("success", false);
            result.put("message", "用户名或密码错误");
        }
        return result;
    }
}
