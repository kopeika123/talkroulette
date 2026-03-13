import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class AuthUserModel extends Model<
  InferAttributes<AuthUserModel>,
  InferCreationAttributes<AuthUserModel>
> {
  declare id: CreationOptional<string>;
  declare provider: string;
  declare providerUserId: string;
  declare name: string;
  declare email: string;
  declare avatarUrl: string;
  declare accessToken: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare lastLoginAt: CreationOptional<Date>;
}

export const initAuthUserModel = (
  sequelize: Sequelize,
): typeof AuthUserModel => {
  AuthUserModel.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      provider: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      providerUserId: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'provider_user_id',
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      avatarUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        field: 'avatar_url',
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        field: 'access_token',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'last_login_at',
      },
    },
    {
      sequelize,
      modelName: 'AuthUser',
      tableName: 'auth_users',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['provider', 'provider_user_id'],
        },
      ],
    },
  );

  return AuthUserModel;
};
