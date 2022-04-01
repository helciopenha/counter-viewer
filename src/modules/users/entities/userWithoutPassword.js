class UserWithoutPassword {
  constructor({
    userId,
    email,
    name,
    username,
    created_at,
    updated_at,
  }) {
    this.userId = userId
    this.email = email
    this.name = name
    this.username = username
    this.created_at = created_at
    this.updated_at = updated_at
  }
}

module.exports = UserWithoutPassword