package com.github.vantonov1.meet.dto

import com.github.vantonov1.meet.entities.Comment

data class CommentDTO(val createdBy: Int, val about: Long, val rate:Byte, val text: String) {
    fun toEntity() = Comment(null, createdBy, about, rate, text)
}

fun fromEntity(comment: Comment): CommentDTO = CommentDTO(comment.createdBy, comment.about, comment.rate, comment.text)