FROM node:12.13-buster
ENV DEBIAN_FRONTEND=noninteractive

# Add non-root user for devcontainer use
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID
# RUN groupadd --gid $USER_GID $USERNAME \
#     && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

# install packages
RUN apt-get update \
    && apt-get install -y git sudo

# add non-root user as sudoers
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
